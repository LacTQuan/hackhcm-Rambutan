import subprocess
import time
import threading

# Function to capture the output of a process
def read_process_output(process):
    while True:
        output = process.stdout.readline()
        if process.poll() is not None:
            break
        if output:
            print(output.strip().decode())

def main():

    # Command to start the Uvicorn server
    uvicorn_command = ["uvicorn", "main:app","--port", "8884"]

    # Start the Uvicorn server
    uvicorn_process = subprocess.Popen(uvicorn_command)

    # Command to start localtunnel
    localtunnel_command = ["npx", "lt", "--port", "8884"]

    # Start localtunnel to expose the server
    localtunnel_process = subprocess.Popen(localtunnel_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Capture the output of the localtunnel process in a separate thread
    thread = threading.Thread(target=read_process_output, args=(localtunnel_process,))
    thread.start()

    # Print a message indicating the server is running
    print("Server is running and exposed via localtunnel.")

    # Example: Wait for user input to stop the servers
    input("Press Enter to stop the servers...\n")

    # Terminate both processes
    uvicorn_process.kill()
    localtunnel_process.kill()

    # Ensure both processes have terminated/
    uvicorn_process.wait()
    localtunnel_process.wait()
    print("Servers stopped")

if __name__ == "__main__":
    main()
