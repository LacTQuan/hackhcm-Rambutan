%%writefile main.py
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import gc
import re
import json
import torch
import os
from paddleocr import PaddleOCR
from transformers import (AutoImageProcessor,
                          AutoModelForImageClassification,
                          Owlv2Processor,
                          Owlv2ForObjectDetection)
import kornia as K
from kornia.contrib import FaceDetector, FaceDetectorResult
from Levenshtein import distance
from matplotlib import pyplot as plt
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
from groq import Groq
import torchvision.ops as ops
from collections import defaultdict
import random
import requests
from io import BytesIO
import concurrent.futures
# GLOBAL VARIABLES
genai.configure(api_key="")
GROQ_CLIENT = Groq(api_key="")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(device)

BRAND_LOGOS = ["heineken","biaviet","larue","bivina","strongbow","tiger","edelweiss"]
BRAND_SIGNATURES = ["beer carton boxes",
                    "beer bottles",
                    "beer cans",
                    "beer crates",
                    "beer kegs"
                    "ice bucket",
                    "beer billboard",
                    "beer poster",
                    "standee",
                    "beer signboard",
                    "parasol", 
                    "yellow beer liquid"]
CAPTIONING_PROMPT = """
    What is shown in given image?.
    First of all, evaluate in detail (about 200 words) the success of events by counting attendees and analyzing their mood and atmosphere.
    Determine the scene context (e.g., bar, restaurant, grocery store, or supermarket).
    Describe the number of customers, their activities, and emotions. Any waitstaff?
    Are there any beer logos (including Heineken, Biaviet, Larue, Bivina, Strongbow, Tiger, Edelweiss) and any logo of competitors (other brands besides the 7 mentioned brands), any posters, banners, and billboards, and identify products like beer kegs and bottles? Specifically, count the number of people drinking beer and identify beer promotional materials (e.g., ice buckets, standees, umbrellas, display shelves).   
"""

REASONING_PROMPT ="""
    I am a sales representative for the Heineken brand. Please act as an expert in the field of communication and sales.
    Think step-by-step and help me analyze and provide feedback based on the criteria given below:
    Image Description:
    {image_description}

    Criteria:
    1. Brand Logos: Identify any brand logos mentioned in the image description.
    2. Products: Mention any products such as beer kegs and bottles.
    3. Customers: Describe the number of customers, their activities, and emotions.
    4. Promotional Materials: Identify any posters, banners, and billboards.
    5. Setup Context: Determine the scene context (e.g., bar, restaurant, grocery store, or supermarket).
    6. Success Criteria: Evaluate the success of events by counting attendees and analyzing their mood and atmosphere.
    7. Identify any logos of competitors and other brands mentioned in the image description

    Insights:
    """

def load_file_from_uri(url):
    # Check if the URL is a Google Drive link
    if "drive.google.com" in url:
        file_id = url.split('/')[-2]
        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    else:
        download_url = url

    # Send a GET request to the URL
    response = requests.get(download_url)

    # Check if the request was successful
    if response.status_code == 200:
        # Load the image into memory
        image = Image.open(BytesIO(response.content)).convert("RGB")
        return image
    else:
        raise Exception(f"Failed to download image: {response.status_code}")

def cleanup():
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

# INITIALIZING MODELS
OCR_MODEL = PaddleOCR(use_angle_cls=True, lang='en',use_gpu = True,show_log = False)
FACE_DETECTOR = FaceDetector().to("cuda:0")
FER_PROCESSOR = AutoImageProcessor.from_pretrained("dima806/facial_emotions_image_detection")
FER_MODEL = AutoModelForImageClassification.from_pretrained("dima806/facial_emotions_image_detection")
OD_MODEL = Owlv2ForObjectDetection.from_pretrained("google/owlv2-base-patch16-ensemble").to("cuda:1")
OD_PROCESSOR = Owlv2Processor.from_pretrained("google/owlv2-base-patch16-ensemble")
IC_MODEL = genai.GenerativeModel(model_name="gemini-1.5-flash")

# OCR
def sanitize_text(text):
    """remove all non-alphanumeric characters except spaces and convert to lowercase"""
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    return text.lower().strip()

def GET_ocr(images, logo_list, L_score = 4):
    """ returns the OCR results with bounding boxes and confidence scores"""
    """ PARAMETERS
    images: list[np.ndarray]  = input images
    L_score: int = levenshtein distance threshold for logo detection
    """
    """ RETURNS: dict = {logo: [[x1, y1, x2, y2, score]]}"""
    results = []
    for image in images:
        logo_results = defaultdict(list)
        ocr_raw = OCR_MODEL.ocr(image,cls=True)[0]
        if not ocr_raw:
            results.append(logo_results)
            continue
        for box, (text, score) in ocr_raw:
            text = sanitize_text(text)
            if text:
                for logo in logo_list:
                    if distance(text, logo) < L_score:
                        logo_results[logo].append([int(box[0][0]), int(box[0][1]), int(box[2][0]), int(box[2][1]), score])
                        break
        results.append(logo_results)
    return results
# FACE & FER
def GET_face_emotion_detection(images,
                    detect_emotion = True,
                    detect_thresh = 0.92,
                    min_area = 1000):

    """ returns the face emotion detection results with bounding boxes and confidence scores"""
    """ PARAMETERS
    images: list[np.ndarray]  = input images
    detect_emotion: bool = whether to detect emotions
    detect_thresh: float = detection threshold
    min_area: int = minimum area for detection
    """
    """ RETURNS: dict = {emotion: [[x1, y1, x2, y2, score]]}"""
    results = []
    for image in images:
        image = K.image_to_tensor(image, keepdim=False).float().to("cuda:0")
        cleanup()
        with torch.no_grad():
            face_results = FACE_DETECTOR(image)

        faces =  [FaceDetectorResult(det) for det in face_results[0]]
        face_results = defaultdict(list)
        for face in faces:
            top_left = face.top_left.int().tolist()
            bottom_right = face.bottom_right.int().tolist()
            score = face.score.tolist()
            x1, y1 = top_left
            x2, y2 = bottom_right
            area = (x2 - x1) * (y2 - y1)
            if score > detect_thresh:
                if detect_emotion and area > min_area:
                    face_image = image[..., y1:y2, x1:x2].cuda()
                    outputs = FER_MODEL(**FER_PROCESSOR(face_image, return_tensors="pt"))
                    emotion = FER_MODEL.config.id2label[torch.argmax(outputs.logits[0]).item()]
                    face_results[emotion.lower()].append(top_left + bottom_right + [score])
                else:
                    face_results["unknown"].append(top_left + bottom_right + [score])
        results.append(face_results)
    return results

# OBJECT DETECTION
def compute_iou(box1, box2):
    x1, y1, x2, y2 = box1[:4]
    x1_prime, y1_prime, x2_prime, y2_prime = box2[:4]

    # Calculate the intersection coordinates
    xi1 = max(x1, x1_prime)
    yi1 = max(y1, y1_prime)
    xi2 = min(x2, x2_prime)
    yi2 = min(y2, y2_prime)

    # Calculate the intersection area
    inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)

    # Calculate the areas of both bounding boxes
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x2_prime - x1_prime) * (y2_prime - y1_prime)

    # Calculate the union area
    union_area = box1_area + box2_area - inter_area

    # Compute the IoU
    iou = inter_area / union_area

    return iou

def merge_boxes(box1, box2):
    x1, y1, x2, y2, score1 = box1
    x1_prime, y1_prime, x2_prime, y2_prime, score2 = box2

    new_x1 = min(x1, x1_prime)
    new_y1 = min(y1, y1_prime)
    new_x2 = max(x2, x2_prime)
    new_y2 = max(y2, y2_prime)
    new_score = (score1 + score2) / 2

    return [new_x1, new_y1, new_x2, new_y2, new_score]

def merge_overlapping_boxes(d, iou_threshold=0.5):
    d = d.copy()
    for class_name in d:
        boxes = d[class_name]
        merged = []

        while boxes:
            box = boxes.pop(0)
            to_merge = []
            for other_box in boxes:
                if compute_iou(box, other_box) > iou_threshold:
                    box = merge_boxes(box, other_box)
                    to_merge.append(other_box)

            for m in to_merge:
                boxes.remove(m)

            merged.append(box)

        d[class_name] = merged

    return d

def GET_object_detection(images, detect_classes, threshold=0.25, nms_threshold=0.2, merge=False, merge_threshold=0.5):
    """ returns the object detection results with bounding boxes and confidence scores"""
    """ PARAMETERS
    images: list[np.ndarray]  = input images
    detect_classes: list = list of classes to detect
    threshold: float = detection threshold
    nms_threshold: float = non-maximum suppression threshold
    merge: bool = whether to merge overlapping boxes
    merge_threshold: float = merge threshold
    """
    """ RETURNS: dict = {class: [[x1, y1, x2, y2, score]]}"""
    detected_results = []
    special_index = len(detect_classes)-1
    for i in range(len(images)):
        inputs = OD_PROCESSOR(text=detect_classes,images=images[i], return_tensors="pt").to("cuda:1")
        with torch.no_grad():
            outputs = OD_MODEL(**inputs)
        target_sizes = torch.Tensor([images[i].size[::-1]])
        results = OD_PROCESSOR.post_process_object_detection(outputs=outputs, target_sizes=target_sizes, threshold=threshold)
        boxes, scores, labels = results[0]["boxes"], results[0]["scores"], results[0]["labels"]
        if not merge:
            keep = ops.batched_nms(boxes, scores, labels, nms_threshold)
            boxes, scores, labels = boxes[keep], scores[keep], labels[keep]
        detected_objects = defaultdict(list)
        for box, score, label in zip(boxes, scores, labels):
            if score > threshold:
                box = [int(i) for i in box.tolist()]
                if label.item() != special_index:
                    detected_objects[detect_classes[label.item()]].append(box + [score.item()])
                else:
                    detected_objects["beer"].append(box + [score.item()])
        if merge:
            detected_objects = merge_overlapping_boxes(detected_objects, merge_threshold)
        detected_results.append(detected_objects)
    return detected_results


# IMAGE CAPTIONING
def GET_image_captioning(images, prompt):
    """PARAMETERS"""
    """images_list: list = list of image files
    prompt: str = prompt for image captioning"""
    """RETURNS: list[str] = list of image captions""""beer"
    results = []
    for image in images:
        response = IC_MODEL.generate_content([prompt,image])
        results.append(response.text.strip())
    return results
    
# IMAGE REASONING
def GET_image_analysis(image_descriptions, prompt):
    """PARAMETERS"""
    """image_descriptions: list = list of image descriptions
    prompt: str = prompt for image reasoning"""
    """RETURNS: list[str] = list of image analysis"""
    responses = []
    for image_description in image_descriptions:
        prompt = REASONING_PROMPT.format(image_description=image_description)
        data = {
            "model": "gemma-7b-it",
            "messages": [{"role": "user", "content": prompt}]
        }
        response = GROQ_CLIENT.chat.completions.create(**data).choices[0].message
        responses.append(response.content)
    return responses

def run_in_parallel(img_list, img_list_np):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        ocr = executor.submit(GET_ocr, *(img_list_np,BRAND_LOGOS))
        face = executor.submit(GET_face_emotion_detection, img_list_np)
        od = executor.submit(GET_object_detection, *(img_list,BRAND_SIGNATURES))
        ic = executor.submit(GET_image_captioning, *(img_list,CAPTIONING_PROMPT))
        reasoning = executor.submit(GET_image_analysis, *(ic.result(),REASONING_PROMPT))
    return ocr.result(), face.result(), od.result(), ic.result(), reasoning.result()

# FAST API APP

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
app = FastAPI()

class ImageSchema(BaseModel):
    images: List[str]

# API endpoints

@app.get("/")
def read_root():
    return {"Hello": "Rambutan"}

@app.post("/analyze/")
async def upload_images(data: ImageSchema):
#     try:
    data = data.dict()
    received_urls = []
    img_list = []
    img_list_np = []
    for uri in data['images']:
        try:
            file = load_file_from_uri(uri) 
            img_list.append(file)
            img_list_np.append(np.array(file))
            received_urls.append(uri)
        except:
            print("Cannot fetch image: ",uri)
    if len(img_list):
        ocr, face, od, ic, reasoning = run_in_parallel(img_list, img_list_np)
        cleanup()
        return [{'imageUrl':e,
                 'objects':{**a,**b,**c},
                 'reasoning': d,
                } for a,b,c,d,e in zip(ocr, face, od, reasoning, received_urls)]
    else:
        return {"error":"No valid images received."}
#     except Exception as e:
#         print(e)
#         return {"error":"500 Server Busy"}