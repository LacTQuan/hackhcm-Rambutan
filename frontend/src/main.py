# read json file
import json

with open('./data.json') as f:
    data = json.load(f)

labels = set()

for item in data:
    labels.add(item['label'])

boxes = {}
for label in labels:
    boxes[label] = []
    for item in data:
        if item['label'] == label:
            boxes[label].append(item['box'])

# write to json file
with open('./boxes.json', 'w') as f:
    json.dump(boxes, f)