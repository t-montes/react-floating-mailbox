import React, { useState } from "react";
import "./FloatingMailbox.css";
import emailjs from 'emailjs-com';

function FloatingMailbox(props) {
    /**
     * @param {string} serviceId - Email service id
     * @param {string} templateId - Email template id
     * @param {string} userId - Email user id
     * @param {string} to [optional] - Email address to send the email to
     * @param {string} subject [optional] - Default (non- ) subject for the email
     */

    const [isOpen, setIsOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);

    function sendEmail(e) {
      e.preventDefault();
      emailjs.sendForm(
          props.serviceId,
          props.templateId,
          e.target,
          props.userId
        ).then(
          (result) => {
            console.log(result.text);
            if (result.text === "OK")
              setIsSent(!isSent);
          },
          (error)  => console.log(error.text)
        );
        setIsSent(!isSent);
    }

    return (
      <React.Fragment>
        { isSent ?
        <div className="floating-button-sent">
          <button>
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet">

            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M3057 3343 l-1277 -1278 -493 493 c-270 270 -497 492 -502 492 -6 0
            -184 -174 -398 -388 l-387 -387 888 -887 887 -887 1673 1667 1673 1667 -393
            392 -393 393 -1278 -1277z"/>
            </g>
          </svg>
          </button>
        </div>
        :
        <div className="floating-button">
            <button onClick={() => setIsOpen(!isOpen)}>
            <svg className={`${isOpen ? "" : "wiggler"}`} version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="560.000000pt" height="560.000000pt" viewBox="0 0 560.000000 560.000000"
            preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,560.000000) scale(0.100000,-0.100000)"
              fill="#000000" stroke="none">
              <path d="M1305 3891 c-84 -39 -115 -100 -115 -229 l0 -88 805 -413 805 -412
              805 412 805 413 0 90 c-1 131 -34 193 -122 231 -33 13 -201 15 -1490 15 -1391
              0 -1455 -1 -1493 -19z"/>
              <path d="M1190 2775 c0 -267 2 -485 6 -485 3 0 168 131 367 292 199 160 363
              292 365 294 3 2 -127 70 -530 278 l-208 107 0 -486z"/>
              <path d="M4045 3073 c-198 -102 -363 -188 -366 -191 -7 -8 720 -597 727 -590
              2 3 3 221 2 485 l-3 481 -360 -185z"/>
              <path d="M1648 2408 l-458 -370 0 -86 c1 -127 35 -190 122 -227 33 -13 201
              -15 1490 -15 1391 0 1455 1 1493 19 83 38 115 100 115 225 l0 84 -460 371
              c-253 204 -464 371 -469 371 -5 0 -157 -76 -339 -170 -182 -93 -336 -170 -342
              -170 -6 0 -160 77 -342 170 -182 94 -336 170 -342 169 -6 0 -217 -167 -468
              -371z"/>
              </g>
            </svg>
          </button>

          <form className={`floating-form ${isOpen ? "" : "unactive"}`} onSubmit={sendEmail}>
              { props.to ?
                <input type="email" name="to_email" className="unactive" defaultValue={props.to} />
                : 
                <input type="email" name="to_email" placeholder="Email" required />
              }
              {
                props.subject ?
                <input type="text" name="subject" defaultValue={props.subject} readOnly />
                :
                <input type="text" name="subject" placeholder="Subject" required />
              }
              <textarea name="message" placeholder="Write your message here..." required />
              <button type="submit">Send</button>
          </form>
        </div>
        }
      </React.Fragment>
    );
}

export default FloatingMailbox;