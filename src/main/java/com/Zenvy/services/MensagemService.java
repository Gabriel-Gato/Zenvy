package com.Zenvy.services;

import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Mensagem;
import com.Zenvy.repositories.MensagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensagemService {

    private final MensagemRepository mensagemRepository;

    public Mensagem enviarMensagem(Mensagem mensagem) {
        if (mensagem.getConteudo() == null || mensagem.getConteudo().isBlank()) {
            throw new IllegalArgumentException("O conteúdo da mensagem não pode estar vazio.");
        }

        mensagem.setDataEnvio(Instant.now());
        mensagem.setLida(false);

        return mensagemRepository.save(mensagem);
    }

    public List<Mensagem> listarMensagensRecebidas(Long idDestinatario) {
        return mensagemRepository.findByIdDestinatarioOrderByDataEnvioDesc(idDestinatario);
    }

    public Mensagem marcarComoLida(Long idMensagem) {
        var mensagem = mensagemRepository.findById(idMensagem)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem não encontrada."));

        mensagem.setLida(true);
        return mensagemRepository.save(mensagem);
    }

    public void deletarMensagem(Long idMensagem) {
        if (!mensagemRepository.existsById(idMensagem)) {
            throw new ResourceNotFoundException("Mensagem não encontrada.");
        }
        mensagemRepository.deleteById(idMensagem);
    }

    public List<Mensagem> listarMensagensEnviadas(Long idRemetente) {
        return mensagemRepository.findByIdRemetenteOrderByDataEnvioDesc(idRemetente);
    }
}
