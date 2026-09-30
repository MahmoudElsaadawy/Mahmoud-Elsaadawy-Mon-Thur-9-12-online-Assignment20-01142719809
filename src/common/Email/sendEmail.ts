import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export const sendEmail = async({to, subject, html}: {to:string, subject:string, html:string})=> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  const info = await transporter.sendMail({
    from: `E-commerce App <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}
