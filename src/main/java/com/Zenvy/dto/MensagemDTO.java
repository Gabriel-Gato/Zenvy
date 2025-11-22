package com.Zenvy.dto;

import com.Zenvy.models.Mensagem;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class MensagemDTO {
    private Long id;
    private String conteudo;
    private boolean enviadaPeloUsuario;
    private Instant dataEnvio;

    public MensagemDTO(Mensagem mensagem, Long idUsuarioLogado) {
        this.id = mensagem.getId();
        this.conteudo = mensagem.getConteudo();
        this.dataEnvio = mensagem.getDataEnvio();

        this.enviadaPeloUsuario = mensagem.getIdRemetente().equals(idUsuarioLogado);
    }
}
