var nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  service: 'smtp-pt.securemail.pro',
  secure: true,
  port: 465,
  auth: {
    user: process.env.eyeou_user,
    pass: process.env.eyeou_pass
  },
  from: `EYEOU <${process.env.eyeou_user}>`,
  host: 'smtp-pt.securemail.pro'
});

exports.sendEmail = ({ $mailTo, $subject, $html }) => {
  const mailOptions = {
    to: $mailTo,
    subject: $subject,
    html: $html,
    from: `EYEOU <${process.env.eyeou_user}>`,
    host: 'smtp-pt.securemail.pro'
  }

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) return reject(error)
      return resolve(response)
    });
  })
};

exports.registrationEmail = ({ $mailTo }) => {
  exports.sendEmail({
    $mailTo,
    $subject: 'Eyeou welcome!',
    $html: `
    <div>
      <h2>Hello!</h2> <br>
      <p>
        You have just joined up to our community, we are hope that you will have a great experience with us and enjoy it!
      </p>
      <p>
        Check the <a href="https://www.eyeou.net" target="_blank">available contests</a> and good luck!
      </p>
      <p>Great Shots!</p>
      <img 
          src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
          style="width: 25%"
      />
      <p>
      Alguma questão, contacte-nos em <a href="mailto:support@eyeou.net">support@eyeou.net</a>
      </p>
    </div>
    `
  })
}

exports.sendEmailExpress = (req, res) => {
  const { name, email, subject, message } = req.body;
  exports.sendEmail({
    $mailTo: process.env.owner_email,
    $subject: subject,
    $html: `
      <h3>Name: ${name}</h3>
      <h5>Email: ${email}</h5>
      <p>${message}</p>
    `
  })
    .then(info => res.status(200).json(info))
    .catch(error => res.status(500).json(error))
}

exports.validationEmailTemplate = (lang, accessCode) => {
  const html = {
    en: `
      <div>
        <h2>Hello!</h2> <br>
        <p>Your verification code to verify your email is: ${accessCode}</p>
        <p>Great Shots!</p>
        <img 
            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
            style="width: 25%"
        />
        <p>
        Alguma questão, contacte-nos em <a href="mailto:support@eyeou.net">support@eyeou.net</a>
        </p>
      </div>
    `,
    pt: `
      <div>
        <h2>Hello!</h2> <br>
        <p>Your verification code to verify your email is: ${accessCode}</p>
        <p>Great Shots!</p>
        <img 
            src="https://lh5.googleusercontent.com/YVZbtwcEGhhTTLRn5ekI852WwZ-_3rhg5wi1dRN67CkobT_NM3X59k0pmCjTOWRlT0UHAAG059EF-8xAVkYbueeOVeXNPLpk0UwlZNFbvyRIsFPxgWIsCTiEEtfUkTa-vT_kAQP2"
            style="width: 25%"
        />
        <p>
            For any question contact us at <a href='mailto:support@eyeou.net'>support@eyeou.net</a>
        </p>
      </div>
    `
  }

  const subject = {
    en: 'EYEOU email contest validation',
    pt: 'EYEOU validação de e-mail'
  }

  if (lang == 'en') {
    return {
      html: html.en,
      subject: subject.en
    }
  } else {
    return {
      html: html.pt,
      subject: subject.pt
    }
  }
}