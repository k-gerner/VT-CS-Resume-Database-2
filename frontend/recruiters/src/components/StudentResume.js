import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {Toast} from 'react-bootstrap';
import '../main.css'

export default function StudentResume({currStudent}) {
    const defaultLayout = defaultLayoutPlugin();


    return (
        <>
            {currStudent !== null ?
                currStudent.resume !== null ?
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                        <Viewer fileUrl={'http://127.0.0.1:8000' + currStudent.resume}
                            plugins={[defaultLayout]}
                            defaultScale={SpecialZoomLevel.ActualSize} />
                    </Worker>
                    :
                    <div className="d-flex justify-content-center flex-row" style={{marginTop:'40%'}}>
                        <Toast>
                            <Toast.Header closeButton={false}>
                                {/* <img src={require('./vt_logo.png')} className="rounded me-2" alt="VT logo" /> */}
                                <strong className="me-auto">VT CS</strong>
                                <small>{new Date().toLocaleString("en-US", { month: "long", day:"2-digit" })}</small>
                            </Toast.Header>
                            <Toast.Body>This student has not uploaded a resume yet.</Toast.Body>
                        </Toast>
                    </div>
                :
                <>
                </>
            }
        </>
    )
}