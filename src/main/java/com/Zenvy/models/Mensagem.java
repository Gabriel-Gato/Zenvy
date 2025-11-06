package com.Zenvy.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_remetente", nullable = false)
    private Long idRemetente;

    @Column(name = "tipo_remetente", nullable = false, length = 20)
    private String tipoRemetente;

    @Column(name = "id_destinatario", nullable = false)
    private Long idDestinatario;

    @Column(name = "tipo_destinatario", nullable = false, length = 20)
    private String tipoDestinatario;

    @Column(name = "conteudo", columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(name = "data_envio", nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Sao_Paulo")
    private Instant dataEnvio;

    @Column(name = "lida", nullable = false)
    private boolean lida = false;
}
