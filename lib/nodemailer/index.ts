"use server"


// this is email content function, there are types of email notifications and their content is generated here you can send here notifications to users by just using nodemailer
import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
  ) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Vítejte v CentrumHlídači pro ${shortenedTitle}`;
      body = `
        <div>
          <h2>Vítejte v CentrumHlídači 🚀</h2>
          <p>Nyní si hlídáte ${product.title}.</p>
          <p>Zde je příklad toho, jak budete dostávat aktualizace:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} je opět skladem!</h3>
            <p>Jsme rádi, že vám to můžeme oznámit ${product.title} je opět skladem.</p>
            <p>Neprošvihněte to - <a href="${product.url}" target="_blank" rel="noopener noreferrer">Koupit Nyní</a>!</p>
            <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Zůstaňte naladěni na další aktualizace ${product.title} a další produkty, které sledujete.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} je nyní opět skladem!`;
      body = `
        <div>
          <h4>Zdravím, ${product.title} je naskladněn! Popadněte to, než zase dojdou!</h4>
          <p>Zobrazit produkt <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Upozornění na nejnižší cenu pro ${shortenedTitle}`;
      body = `
        <div>
          <h4>Zdravím, ${product.title} dosáhl/a/o své nejnižší ceny!!</h4>
          <p>Vyzvednout si svůj produkt <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Upozornění na slevu pro ${shortenedTitle}`;
      body = `
        <div>
          <h4>Zdravím, ${product.title} je nyní k dispozici se slevou více než ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Vyzvedněte si to hned <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nathanaelnux@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});
export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: 'nathanaelnux@gmail.com',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if(error) return console.log(error);
    
    console.log('Email sent: ', info);
  })
}