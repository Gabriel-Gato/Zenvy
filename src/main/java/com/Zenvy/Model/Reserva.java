package com.Zenvy.Model;

import com.Zenvy.Model.Enum.StatusReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
