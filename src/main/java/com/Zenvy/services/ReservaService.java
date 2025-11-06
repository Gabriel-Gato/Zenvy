package com.Zenvy.services;

import com.Zenvy.config.EmailService;
import com.Zenvy.exceptions.BusinessException;
import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.enums.StatusReserva;
import com.Zenvy.models.Reserva;
import com.Zenvy.repositories.ImovelRepository;
import com.Zenvy.repositories.ReservaRepository;
import com.Zenvy.repositories.UsuarioRepository;
import com.Zenvy.exceptions.EmailException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ImovelRepository imovelRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;


    public Reserva criarReserva(Long imovelId, Long hospedeId, Reserva reserva) {
        var imovel = imovelRepository.findById(imovelId)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));

        var hospede = usuarioRepository.findById(hospedeId)
                .orElseThrow(() -> new ResourceNotFoundException("Hóspede não encontrado"));


        if (reserva.getDataCheckin() == null || reserva.getDataCheckout() == null) {
            throw new BusinessException("Datas de check-in e check-out são obrigatórias");
        }

        if (reserva.getDataCheckout().isBefore(reserva.getDataCheckin())) {
            throw new BusinessException("Data de checkout não pode ser antes do checkin");
        }


        List<Reserva> reservasExistentes = reservaRepository.findByImovelId(imovelId);
        for (Reserva r : reservasExistentes) {
            boolean conflito = !(reserva.getDataCheckout().isBefore(r.getDataCheckin()) ||
                    reserva.getDataCheckin().isAfter(r.getDataCheckout()));
            if (conflito && r.getStatus() != StatusReserva.CANCELADA) {
                throw new BusinessException("Imóvel já reservado para o período selecionado");
            }
        }

        if (imovel.getPrecoPorNoite() != null) {
            long dias = ChronoUnit.DAYS.between(reserva.getDataCheckin(), reserva.getDataCheckout());
            reserva.setValorTotal(imovel.getPrecoPorNoite() * dias);
        }

        reserva.setImovel(imovel);
        reserva.setHospede(hospede);
        reserva.setStatus(StatusReserva.CONFIRMADA);

        var reservaSalva = reservaRepository.save(reserva);

        try {
            emailService.enviarConfirmacaoDeReserva(
                    reservaSalva.getHospede().getEmail(),
                    "Confirmação de Reserva - " + imovel,
                    "Olá " + hospede.getNome() + ",\n\n" +
                            "Sua reserva no imóvel foi confirmada!\n" +
                            "Check-in: " + reservaSalva.getDataCheckin() + "\n" +
                            "Check-out: " + reservaSalva.getDataCheckout() + "\n" +
                            "Valor total: R$ " + reservaSalva.getValorTotal() + "\n\n" +
                            "Obrigado por reservar com o Arbnb!"
            );
        } catch (EmailException e) {
            System.err.println("Falha ao enviar e-mail de confirmação: " + e.getMessage());
        }
        return reservaSalva;
    }


    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }


    public List<Reserva> listarPorHospede(Long hospedeId) {
        return reservaRepository.findByHospedeId(hospedeId);
    }


    public List<Reserva> listarPorImovel(Long imovelId) {
        return reservaRepository.findByImovelId(imovelId);
    }

    public Reserva atualizar(Long id, Reserva reservaAtualizada) {
        var reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada"));

        if (reservaAtualizada.getDataCheckin() != null)
            reserva.setDataCheckin(reservaAtualizada.getDataCheckin());

        if (reservaAtualizada.getDataCheckout() != null)
            reserva.setDataCheckout(reservaAtualizada.getDataCheckout());

        if (reservaAtualizada.getStatus() != null)
            reserva.setStatus(reservaAtualizada.getStatus());

        if (reservaAtualizada.getValorTotal() != null)
            reserva.setValorTotal(reservaAtualizada.getValorTotal());

        return reservaRepository.save(reserva);
    }


    public void cancelarReserva(Long reservaId) {
        var reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada"));

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);

        try {
            emailService.enviarCancelamentoDeReserva(
                    reserva.getHospede().getEmail(),
                    "Cancelamento de Reserva - " + reserva.getImovel(),
                    "Olá " + reserva.getHospede().getNome() + ",\n\n" +
                            "Sua reserva no imóvel '" + reserva.getImovel() + "' foi cancelada.\n" +
                            "Esperamos vê-lo novamente em breve!\n\n" +
                            "Equipe Arbnb."
            );
        } catch (EmailException e) {
            System.err.println("Falha ao enviar e-mail de cancelamento: " + e.getMessage());
        }
    }

    public void deletarPorId(Long id) {
       if (!reservaRepository.existsById(id)) {
           throw new ResourceNotFoundException("Reserva não encontrada");
       }
       reservaRepository.deleteById(id);
    }
}

