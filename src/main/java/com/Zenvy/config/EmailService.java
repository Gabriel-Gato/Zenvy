package com.Zenvy.config;

import com.Zenvy.exceptions.EmailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final JavaMailSender mailSender;


    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void enviarConfirmacaoDeReserva(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@arbnb.com");

            mailSender.send(message);
        } catch (Exception ex) {
            throw new EmailException("Erro ao enviar e-mail de confirmação", ex);
        }
    }


    public void enviarCancelamentoDeReserva(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@arbnb.com");

            mailSender.send(message);
        } catch (Exception ex) {
            throw new EmailException("Erro ao enviar e-mail de cancelamento", ex);
        }
    }
}
