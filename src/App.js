// import logo from './logo.svg';
import './App.css';

import { React, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Courses from './courses';
import * as courseActions from "./app/actions/CourseActions";
import Start from './start';
import * as startActions from "./app/actions/StartActions";
import Finish from './finish';
import * as finishActions from "./app/actions/FinishActions";
import StartMinutesMargins from './startMinutesMargins';
import * as startMinutesMarginsActions from "./app/actions/StartMinutesMarginActions";
import FinishMinutesMargins from './finishMinutesMargins';
import * as finishMinutesMarginsActions from "./app/actions/FinishMinutesMarginActions";

import axios from "axios";

import logo from './logo.svg';

import Alert from "@mui/material/Alert";

function App() {

  const [state, setState] = useState('');

  const course = useSelector((store) => store.course.course);
  const start = useSelector((store) => store.start.start);
  const finish = useSelector((store) => store.finish.finish);
  const startMinutesMargin = useSelector((store) => store.startMinutesMargin.startMinutesMargin);
  const finishMinutesMargin = useSelector((store) => store.finishMinutesMargin.finishMinutesMargin);

  const dispatch = useDispatch();

  const clearInputs = () => {
    dispatch(courseActions.course(""));
    dispatch(startActions.start(""));
    dispatch(finishActions.finish(""));
    dispatch(startMinutesMarginsActions.startMinutesMargin(""));
    dispatch(finishMinutesMarginsActions.finishMinutesMargin(""));
  };

  const upload = useCallback(() => {

    const data = {
      course: course,
      start: start,
      finish: finish,
      startMinutesMargin: startMinutesMargin,
      finishMinutesMargin: finishMinutesMargin
    }

    if (
      data.course === "" ||
      data.start === "" ||
      data.finish === "" ||
      data.startMinutesMargin === "" ||
      data.finishMinutesMargin === ""
    ) {
      console.log("ERROR");
      setState('Error');
      return;
    }



    var bodyFormData = new FormData();
    bodyFormData.append('course', data.course);
    bodyFormData.append('start', data.start);
    bodyFormData.append('finish', data.finish);
    bodyFormData.append('startMinutesMargin', data.startMinutesMargin);
    bodyFormData.append('finishMinutesMargin', data.finishMinutesMargin);

    axios({
      method: "post",
      url: "http://localhost:8080/exam",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    })
      .then(function (response) {
        //handle success
        console.log("EXITO");
        setState('Success');
        clearInputs();
      })
      .catch(function (response) {
        //handle error
        
        console.log("ERROR");
        setState('Error');
      });

  }, [course, start, finish, startMinutesMargin, finishMinutesMargin]);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo FIUBA" className="logo-img" />
        <div className="Title">EXAM SCHEDULING</div>
        <Courses />
        <Start />
        <Finish />
        <StartMinutesMargins />
        <FinishMinutesMargins />
        <button onClick={upload}> Agregar nuevo examen </button>
        {(state === 'Success') &&
          <div>
            <Alert variant="outlined" severity="success">
              Examen agregado exitosamente.
            </Alert>
          </div>
        }
        {(state === 'Error') &&
          <div>
            <Alert variant="outlined" severity="error">
              Error
            </Alert>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
