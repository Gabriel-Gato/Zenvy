package com.Zenvy.dto;

import com.Zenvy.models.Reserva;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservaDTO {
    private Long id;
    private LocalDate dataCheckin;
    private LocalDate dataCheckout;
    private Double valorTotal;
    private String status;
    private ImovelSimplesDTO imovel;
    private HospedeDTO hospede;

    public ReservaDTO(Reserva reserva) {
        this.id = reserva.getId();
        this.dataCheckin = reserva.getDataCheckin();
        this.dataCheckout = reserva.getDataCheckout();
        this.valorTotal = reserva.getValorTotal();
        this.status = reserva.getStatus().name();
        this.imovel = new ImovelSimplesDTO(reserva.getImovel());
        this.hospede = new HospedeDTO(reserva.getHospede());
    }
}
