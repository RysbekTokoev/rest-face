import * as React from "react";
import {useEffect, useRef, useState} from "react";
import * as faceapi from 'face-api.js';
import axios from 'axios';

import './Ai.scss';

function getCookie(name: string) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// create props
interface AiProps {
    recognitionCallback: (name: string) => void;
    cameraId: string | undefined;
}

function Ai({ recognitionCallback, cameraId }: AiProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraCanvas = useRef<HTMLCanvasElement>(null);

    const [results, setResults] = useState<Array<any> | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const Url: string = 'http://127.0.0.1:8000/api/main/faces/recognize/';
    const csrftoken: string | null = getCookie('csrftoken');
    const lastRecognizedName = useRef<string | null>(null);
    const lastRecognitionTime = useRef<number>(Date.now());


    function sendFace(detected: any){
        let body={
            encoding: detected,
            portal: 'test',
            camera: ''
        }

        return axios.post(Url, body, {
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        })
          .then(function (response) {
            // if response status is 200 then add name to the #recognized ul list
            // if response status is 200 then add name to the #recognized ul list
            if (response.status === 200) {
                const recognizedName = response.data.name;
                const currentTime = Date.now();

                // Only call recognitionCallback if the recognized name is new and it's been at least one second since the last recognition
                if (recognizedName !== lastRecognizedName.current && currentTime - lastRecognitionTime.current >= 1000) {
                    console.log({recognizedName, currentTime, lastRecognizedName, lastRecognitionTime});
                    lastRecognizedName.current = recognizedName;
                    lastRecognitionTime.current = currentTime;
                    recognitionCallback(recognizedName);
                }
            }


          })
          .catch(function (error) {
            console.log(error);
          });
    }

    async function detectFaces(image: HTMLVideoElement | HTMLImageElement): Promise<Array<any>> {
        if (!image) {
            console.log('no image')
            return [];
        }

        const imgSize: DOMRect = image.getBoundingClientRect();
        const displaySize: { width: number; height: number; } = { width: imgSize.width, height: imgSize.height };

        if (displaySize.height === 0) {
            console.log('image size err')
            return [];
        }

        const faces = await faceapi
            .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors();

        return faceapi.resizeResults(faces, displaySize);
    };
    async function drawResults(image: HTMLVideoElement, canvas: HTMLCanvasElement, results: Array<any>): Promise<void> {
        if (image && canvas && results) {
            const imgSize: DOMRect = image.getBoundingClientRect();
            const displaySize: { width: number; height: number; } = { width: imgSize.width, height: imgSize.height };

            faceapi.matchDimensions(canvas, displaySize);
            canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
            const resizedDetections = faceapi.resizeResults(results, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            resizedDetections.forEach((face: any) => {

                const box = face.detection.box
                const drawBox = new faceapi.draw.DrawBox(
                    box,
                    {
                        label: Math.round(face.age) + " year old " + face.gender
                    }
                )
                drawBox.draw(canvas)
            })

        }
        else {
            console.log('no image, canvas, or results')
        }
    };

    async function getFaces(): Promise<void> {
        console.log('get faces')
        if (videoRef.current !== null && videoRef.current !== undefined) {
            const faces: Array<any> = await detectFaces(videoRef.current/* .video */);
            await drawResults(videoRef.current/* .video */, cameraCanvas.current!, faces);
            setResults(faces);
            if (faces.length > 0) {
                sendFace(faces[0].descriptor)
            }
        }
        console.log('finished get faces')
        if (loading) {
            setLoading(false)
        }
    };

    const clearOverlay = (canvas: any) => {
        canvas.current.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    let [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    let [fileUploadProcessing, setFileUploadProcessing] = useState<boolean>(false);
    const [captureVideo, setCaptureVideo] = useState<boolean>(false);
    function startCamera() {
        setFileUploadProcessing(false);
        setCaptureVideo(true);
        setLoading(true);
        setFileOk(false);
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            videoRef!.current!.srcObject = stream;
            console.log('video starting')
            setIsCameraOn(true);
        }).catch((err) => {
            console.log(err)
        });
    }
    function stopCamera() {
        videoRef.current!.pause();
        videoRef.current!.srcObject = null;
        setCaptureVideo(false);
        clearOverlay(cameraCanvas);
        setIsCameraOn(false);
        setResults(undefined);
    }

    const imgCanvas: any = useRef();

    function startFile() {
        setResults(undefined);
        if (captureVideo) {
            stopCamera();
        }
        setFileUploadProcessing(true);
        setFileOk(false);
        setIsCameraOn(false);
    }
    function cancelFile() {
        setFileUploadProcessing(false);
        setIsCameraOn(false);
        setResults(undefined);
    }
    let [file, setFile] = useState<any>();
    let [fileOk, setFileOk] = useState<boolean>(false);
    let [imgLoading, setImgLoading] = useState<boolean>(false);
    async function fileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        console.log('file upload')
        const { files } = e.target;
        const selectedFiles: FileList = files as FileList;
        setFile(selectedFiles?.[0]);
        setFileUploadProcessing(false);
        setFileOk(true);
        setImgLoading(true);
        setIsCameraOn(false);

        const img: HTMLImageElement = await faceapi.bufferToImage(selectedFiles?.[0]);
        let faces = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()

        console.log(faces)

        if (faces.length === 0) {
            console.log('no faces')
            return;
        } else {
        }

        const canvas = imgCanvas.current;
        faceapi.matchDimensions(canvas, img)
        faces = faceapi.resizeResults(faces, img)
        faceapi.draw.drawDetections(canvas, faces)
        faceapi.draw.drawFaceLandmarks(canvas, faces)
        faceapi.draw.drawFaceExpressions(canvas, faces)

        //draw gender and age
        faces.forEach((face: any) => {

            const box = face.detection.box
            const drawBox = new faceapi.draw.DrawBox(
                box,
                {
                    label: Math.round(face.age) + " year old " + face.gender
                }
            )
            drawBox.draw(canvas)
        })

        setImgLoading(false);




    }

    const intervalRef = useRef<any>(null)
    useEffect(() => {
        if (captureVideo) {
            console.log('video enabled')

            if (videoRef !== null && videoRef !== undefined) {
                intervalRef.current = setInterval(async () => {
                    await getFaces();
                    console.log(captureVideo);
                }, 100);
                console.log(intervalRef.current)
            }
        } else {
            console.log('pong')
            console.log(captureVideo)
            console.log(intervalRef.current)
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

    }, [captureVideo]);

    return (
        <div className="ai">

            <div className='viewer'>
                {
                    captureVideo ?
                        <div className="camera">
                            {loading ? <div className='loading'> <div className='loader'></div> </div> : ''}
                            <video ref={videoRef} width="480px" height="365px" autoPlay></video>
                            <canvas className={'webcam-overlay'} ref={cameraCanvas}></canvas>
                        </div>
                        : (fileUploadProcessing ?
                            <label className="upload">
                                <input type="file" onChange={fileUpload} />
                                <div className='graphic'>
                                    upload
                                    <i className="fas fa-file-upload"></i>
                                </div>
                            </label>
                            :
                            <div className='nocamera'>
                                {
                                    fileOk ?
                                        <div className='uploaded'>
                                            {imgLoading ? <div className='loading'> <div className='loader'></div> </div> : ''}
                                            <img src={URL.createObjectURL(file)} id="create" alt="uploaded file" onLoad={() => console.log('hi')} />
                                            <canvas ref={imgCanvas}></canvas>
                                        </div> :
                                        ''
                                }
                            </div>)
                }
            </div>
            <div className='startstop'>
                {
                    !captureVideo ?
                        <button onClick={startCamera}>start camera</button>
                        : <button onClick={stopCamera}>stop camera</button>
                }
                {
                    <div className='details'>
                        <div>
                            {
                                results == undefined && captureVideo ? <div className='orange'><span></span>loading models</div> 
                                : (
                                    results == undefined ?
                                        <div className='red'><span></span>ai offline</div>
                                        : (
                                            results.length > 0 ?
                                                <div className='green'><span></span>face found</div>
                                                : <div className='red'><span></span>no face found</div>
                                        )
                                )
                            }
                        </div>
                        <div>
                            {
                                captureVideo ? (
                                    !isCameraOn ?
                                        <div className='orange'><span></span>camera loading</div>
                                        : 
                                        <div className='green'><span></span>camera online</div>
                                    ) 
                                    : 
                                    <div className='red'><span></span>camera offline</div>
                            }
                        </div>
                    </div>
                }
                {/*{*/}
                {/*    !fileUploadProcessing ?*/}
                {/*        <button onClick={startFile}>upload file</button>*/}
                {/*        : <button onClick={cancelFile}>cancel upload</button>*/}
                {/*}*/}
            </div>
        </div>
    );
}; export default Ai;