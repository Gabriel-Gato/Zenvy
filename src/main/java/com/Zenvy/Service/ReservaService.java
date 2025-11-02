package com.Zenvy.Service;

import com.Zenvy.Model.Enum.StatusReserva;
import com.Zenvy.Model.Imovel;
import com.Zenvy.Model.Reserva;
import com.Zenvy.Model.Usuario;
import com.Zenvy.Repository.ImovelRepository;
import com.Zenvy.Repository.ReservaRepository;
import com.Zenvy.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ImovelRepository imovelRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;




    public Reserva criarReserva(Long imovelId, Long hospedeId, Reserva reserva) {
        Imovel imovel = imovelRepository.findById(imovelId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        Usuario hospede = usuarioRepository.findById(hospedeId)
                .orElseThrow(() -> new IllegalArgumentException("Hóspede não encontrado"));


        if (reserva.getDataCheckin() == null || reserva.getDataCheckout() == null) {
            throw new IllegalArgumentException("Datas de check-in e check-out são obrigatórias");
        }

        if (reserva.getDataCheckout().isBefore(reserva.getDataCheckin())) {
            throw new IllegalArgumentException("Data de checkout não pode ser antes do checkin");
        }


        List<Reserva> reservasExistentes = reservaRepository.findByImovelId(imovelId);
        for (Reserva r : reservasExistentes) {
            boolean conflito = !(reserva.getDataCheckout().isBefore(r.getDataCheckin()) ||
                    reserva.getDataCheckin().isAfter(r.getDataCheckout()));
            if (conflito && r.getStatus() != StatusReserva.CANCELADA) {
                throw new IllegalArgumentException("Imóvel já reservado para o período selecionado");
            }
        }


        if (imovel.getPrecoPorNoite() != null) {
            long dias = ChronoUnit.DAYS.between(reserva.getDataCheckin(), reserva.getDataCheckout());
            reserva.setValorTotal(imovel.getPrecoPorNoite() * dias);
        }

        reserva.setImovel(imovel);
        reserva.setHospede(hospede);
        reserva.setStatus(StatusReserva.CONFIRMADA);

        return reservaRepository.save(reserva);
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
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

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


    public Reserva cancelar(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));

        reserva.setStatus(StatusReserva.CANCELADA);
        return reservaRepository.save(reserva);
    }


    public void deletar(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
        reservaRepository.delete(reserva);
    }
}

