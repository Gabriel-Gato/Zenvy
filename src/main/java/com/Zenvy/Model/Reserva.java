package com.Zenvy.Model;

import com.Zenvy.Model.Enum.StatusReserva;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Reserva {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "imovel_id")
    private Imovel imovel;

    @ManyToOne
    @JoinColumn(name = "hospede_id")
    private Usuario hospede;

    @Column(nullable = false)
    private LocalDate dataCheckin;

    @Column(nullable = false)
    private LocalDate dataCheckout;

    @Column
    private Double valorTotal;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    public Reserva() {
    }

    public Reserva(Long id, Imovel imovel, Usuario hospede, LocalDate dataCheckin, LocalDate dataCheckout, Double valorTotal, StatusReserva status) {
        this.id = id;
        this.imovel = imovel;
        this.hospede = hospede;
        this.dataCheckin = dataCheckin;
        this.dataCheckout = dataCheckout;
        this.valorTotal = valorTotal;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Imovel getImovel() {
        return imovel;
    }

    public void setImovel(Imovel imovel) {
        this.imovel = imovel;
    }

    public Usuario getHospede() {
        return hospede;
    }

    public void setHospede(Usuario hospede) {
        this.hospede = hospede;
    }

    public LocalDate getDataCheckin() {
        return dataCheckin;
    }

    public void setDataCheckin(LocalDate dataCheckin) {
        this.dataCheckin = dataCheckin;
    }

    public LocalDate getDataCheckout() {
        return dataCheckout;
    }

    public void setDataCheckout(LocalDate dataCheckout) {
        this.dataCheckout = dataCheckout;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public StatusReserva getStatus() {
        return status;
    }

    public void setStatus(StatusReserva status) {
        this.status = status;
    }
}
