// Process the Run the project

1. Make sure you  have node Js installed on your device
2. Run the backend Node Js server
    * go to /server directory in the terminal and run 
    a) npm install
    b) node server.js
3. Run the frontend Server
    * go to /client directory in the terminal and run
    a) npm install
    b) npm run dev
4. Run the OCR service ( FastAPI backend server )
    * go to the /ocr-service directory in the terminal and create a virtual environment first , steps are given at the end
    a) pip install -r requirements.txt
    b) python app.py
5. Run the Summarizer service ( FastAPI backend server )
    * go to the /summarizer-service directory in the terminal and create a virtual environment first , steps are given at the end
    a) pip install -r requirements.txt
    b) python app.py



// Steps to create and run a virtual environment ( To avoid global installation)
1. python -m venv myenv    //here "myenv" is the virtual environment name
2. myenv\Scripts\activate  //your virtual environment is activated.

