import React, { useState } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".unactive{display:none!important}.floating-button,.floating-button-sent{bottom:20px;position:fixed;right:20px;transition:all .3s ease-in-out;z-index:999}.floating-button button,.floating-button-sent button{border:none;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,.2);color:#fff;font-size:20px;height:60px;outline:none;width:60px}.floating-button button{background-color:#4caf50;cursor:pointer}.floating-button-sent button{background-color:#3e8e41;cursor:default;margin-bottom:6px}.floating-button svg{height:60px;margin:0 0 0 -5px;width:60px}.floating-button-sent svg{height:40px;margin:5px 0 0;width:40px}.floating-button button:hover{background-color:#3e8e41}.floating-button button:focus{outline:none}.floating-button button:active{transform:translateY(2px)}.wiggler{animation:wiggle .1s infinite alternate}.floating-form{align-items:center;background-color:#fff;border-radius:10px;bottom:80px;box-shadow:0 0 10px rgba(0,0,0,.2);display:flex;flex-direction:column;height:auto;justify-content:center;padding:10px 20px;position:absolute;right:0;width:275px}.floating-form input,.floating-form textarea{border:1px solid #ccc;border-radius:5px;font-family:Open Sans,sans-serif;margin-bottom:10px;padding:10px;resize:none;width:100%}.floating-form textarea{height:100px}.floating-form button[type=submit]{background-color:#4caf50;border:none;border-radius:5px;color:#fff;cursor:pointer;height:auto;padding:5px}@keyframes wiggle{0%{transform:rotate(-2deg)}to{transform:rotate(2deg)}}";
styleInject(css_248z);

const store = {
    _origin: 'https://api.emailjs.com',
};

/**
 * Initiation
 * @param {string} userID - set the EmailJS user ID
 * @param {string} origin - set the EmailJS origin
 */
const init = (userID, origin = 'https://api.emailjs.com') => {
    store._userID = userID;
    store._origin = origin;
};

const validateParams = (userID, serviceID, templateID) => {
    if (!userID) {
        throw 'The user ID is required. Visit https://dashboard.emailjs.com/admin/integration';
    }
    if (!serviceID) {
        throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
    }
    if (!templateID) {
        throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
    }
    return true;
};

class EmailJSResponseStatus {
    constructor(httpResponse) {
        this.status = httpResponse.status;
        this.text = httpResponse.responseText;
    }
}

const sendPost = (url, data, headers = {}) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', ({ target }) => {
            const responseStatus = new EmailJSResponseStatus(target);
            if (responseStatus.status === 200 || responseStatus.text === 'OK') {
                resolve(responseStatus);
            }
            else {
                reject(responseStatus);
            }
        });
        xhr.addEventListener('error', ({ target }) => {
            reject(new EmailJSResponseStatus(target));
        });
        xhr.open('POST', store._origin + url, true);
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
        xhr.send(data);
    });
};

/**
 * Send a template to the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {object} templatePrams - the template params, what will be set to the EmailJS template
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
const send = (serviceID, templateID, templatePrams, userID) => {
    const uID = userID || store._userID;
    validateParams(uID, serviceID, templateID);
    const params = {
        lib_version: '3.2.0',
        user_id: uID,
        service_id: serviceID,
        template_id: templateID,
        template_params: templatePrams,
    };
    return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
        'Content-type': 'application/json',
    });
};

const findHTMLForm = (form) => {
    let currentForm;
    if (typeof form === 'string') {
        currentForm = document.querySelector(form);
    }
    else {
        currentForm = form;
    }
    if (!currentForm || currentForm.nodeName !== 'FORM') {
        throw 'The 3rd parameter is expected to be the HTML form element or the style selector of form';
    }
    return currentForm;
};
/**
 * Send a form the specific EmailJS service
 * @param {string} serviceID - the EmailJS service ID
 * @param {string} templateID - the EmailJS template ID
 * @param {string | HTMLFormElement} form - the form element or selector
 * @param {string} userID - the EmailJS user ID
 * @returns {Promise<EmailJSResponseStatus>}
 */
const sendForm = (serviceID, templateID, form, userID) => {
    const uID = userID || store._userID;
    const currentForm = findHTMLForm(form);
    validateParams(uID, serviceID, templateID);
    const formData = new FormData(currentForm);
    formData.append('lib_version', '3.2.0');
    formData.append('service_id', serviceID);
    formData.append('template_id', templateID);
    formData.append('user_id', uID);
    return sendPost('/api/v1.0/email/send-form', formData);
};

var emailjs = {
    init,
    send,
    sendForm,
};

function FloatingMailbox(props) {
  /**
   * @param {string} serviceId - Email service id
   * @param {string} templateId - Email template id
   * @param {string} userId - Email user id
   * @param {string} to [optional] - Email address to send the email to
   * @param {string} subject [optional] - Default (non- ) subject for the email
   * @param {string} header [optional] - Custom header for the email
   */

  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  function sendEmail(e) {
    e.preventDefault();
    emailjs.sendForm(props.serviceId, props.templateId, e.target, props.userId).then(result => {
      console.log(result.text);
      if (result.text === "OK") setIsSent(!isSent);
    }, error => console.log(error.text));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, isSent ? /*#__PURE__*/React.createElement("div", {
    className: "floating-button-sent"
  }, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("svg", {
    version: "1.0",
    xmlns: "http://www.w3.org/2000/svg",
    width: "512.000000pt",
    height: "512.000000pt",
    viewBox: "0 0 512.000000 512.000000",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(0.000000,512.000000) scale(0.100000,-0.100000)",
    fill: "#000000",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3057 3343 l-1277 -1278 -493 493 c-270 270 -497 492 -502 492 -6 0\r -184 -174 -398 -388 l-387 -387 888 -887 887 -887 1673 1667 1673 1667 -393\r 392 -393 393 -1278 -1277z"
  }))))) : /*#__PURE__*/React.createElement("div", {
    className: "floating-button"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsOpen(!isOpen)
  }, /*#__PURE__*/React.createElement("svg", {
    className: `${isOpen ? "" : "wiggler"}`,
    version: "1.0",
    xmlns: "http://www.w3.org/2000/svg",
    width: "560.000000pt",
    height: "560.000000pt",
    viewBox: "0 0 560.000000 560.000000",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(0.000000,560.000000) scale(0.100000,-0.100000)",
    fill: "#000000",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1305 3891 c-84 -39 -115 -100 -115 -229 l0 -88 805 -413 805 -412\r 805 412 805 413 0 90 c-1 131 -34 193 -122 231 -33 13 -201 15 -1490 15 -1391\r 0 -1455 -1 -1493 -19z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1190 2775 c0 -267 2 -485 6 -485 3 0 168 131 367 292 199 160 363\r 292 365 294 3 2 -127 70 -530 278 l-208 107 0 -486z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4045 3073 c-198 -102 -363 -188 -366 -191 -7 -8 720 -597 727 -590\r 2 3 3 221 2 485 l-3 481 -360 -185z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1648 2408 l-458 -370 0 -86 c1 -127 35 -190 122 -227 33 -13 201\r -15 1490 -15 1391 0 1455 1 1493 19 83 38 115 100 115 225 l0 84 -460 371\r c-253 204 -464 371 -469 371 -5 0 -157 -76 -339 -170 -182 -93 -336 -170 -342\r -170 -6 0 -160 77 -342 170 -182 94 -336 170 -342 169 -6 0 -217 -167 -468\r -371z"
  })))), /*#__PURE__*/React.createElement("form", {
    className: `floating-form ${isOpen ? "" : "unactive"}`,
    onSubmit: sendEmail
  }, props.header ? /*#__PURE__*/React.createElement("p", null, props.header) : /*#__PURE__*/React.createElement(React.Fragment, null), props.to ? /*#__PURE__*/React.createElement("input", {
    type: "email",
    name: "to_email",
    className: "unactive",
    defaultValue: props.to
  }) : /*#__PURE__*/React.createElement("input", {
    type: "email",
    name: "to_email",
    placeholder: "Email",
    required: true
  }), props.subject ? /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "subject",
    className: "unactive",
    defaultValue: props.subject
  }) : /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "subject",
    placeholder: "Subject",
    required: true
  }), /*#__PURE__*/React.createElement("textarea", {
    name: "message",
    placeholder: "Write your message here...",
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Send"))));
}

export { FloatingMailbox as default };
