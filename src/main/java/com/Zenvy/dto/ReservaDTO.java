package com.Zenvy.dto;

import com.Zenvy.models.Imovel;
import com.Zenvy.models.Reserva;
import com.Zenvy.models.enums.StatusReserva;

import java.time.LocalDate;
import java.util.List;

public class ReservaDTO {
    private Long id;
    private LocalDate dataCheckin;
    private LocalDate dataCheckout;
    private Double valorTotal;
    private String status;
    private ImovelSimplesDTO imovel;

    public ReservaDTO(Reserva reserva) {
        this.id = reserva.getId();
        this.dataCheckin = reserva.getDataCheckin();
        this.dataCheckout = reserva.getDataCheckout();
        this.valorTotal = reserva.getValorTotal();
        this.status = reserva.getStatus().name();
        this.imovel = new ImovelSimplesDTO(reserva.getImovel());
    }

    // getters e setters
}

