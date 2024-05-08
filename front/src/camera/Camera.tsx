import * as React from "react";
import { useEffect, useRef, useState } from 'react';

import * as faceapi from 'face-api.js';
import Ai from './Ai';
import './App.scss';
import PageTemplate from "../common/PageTemplate";



const Recognitions = () => {
	return (
		<div>
			<ul id="recognized">
			</ul>
		</div>
	)
}

const Camera = () => {

	let [ready, setReady] = useState<boolean>(false);

	const loadModels = () => {
		const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
		console.log(process.env.PUBLIC_URL);

		let p: Promise<Array<any>> = Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`),
			faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68_model-weights_manifest.json`),
			faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition_model-weights_manifest.json`),
			faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression_model-weights_manifest.json`),
			faceapi.nets.ageGenderNet.loadFromUri(`${MODEL_URL}/age_gender_model-weights_manifest.json`),
		]);
		return p;

	};
	useEffect(() => {
		loadModels();
		setReady(true);
		console.log('models loaded')
	}, [])

	let emotions = [
		'neutral',
		'happy',
		'sad',
		'angry',
		'fearful',
		'disgusted',
		'surprised'
	]

	let [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
	let [hasResult, setHasResult] = useState<boolean>(false);

	function handleGradient(results: any) {

		if (results === undefined) {
			setHasResult(false);
			return;
		} else {
			setHasResult(true);
		}

		console.log(results)
		let expressions = results[0].expressions;
		console.log(expressions)
		let emotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
		console.log(emotion)
		setCurrentEmotion(emotion);
	}

	function addRecognition(result: any) {
		let recognized = document.getElementById('recognized');
		if (recognized) {
			let li = document.createElement('li');
			li.innerHTML = result;
			recognized.appendChild(li);
		}
	}

	return (
		<PageTemplate>
			<div className="app">
				<div className="camera-container">
					<div className='camera-section'>
						<div className='emotion'></div>
						{
							ready ? <Ai recognitionCallback={addRecognition}/> : 'loading...'
						}
					</div>
					<div className='recognition-section'>
						<Recognitions />
					</div>
				</div>
			</div>
		</PageTemplate>
	);
}; export default Camera;