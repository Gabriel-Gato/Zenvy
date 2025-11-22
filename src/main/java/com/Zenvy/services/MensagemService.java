package com.Zenvy.services;

import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Mensagem;
import com.Zenvy.models.Reserva;
import com.Zenvy.models.Usuario;
import com.Zenvy.models.enums.Role;
import com.Zenvy.repositories.MensagemRepository;
import com.Zenvy.repositories.ReservaRepository;
import com.Zenvy.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    public Mensagem enviarMensagem(Long reservaId, String conteudo, String emailUsuarioLogado) {

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        Usuario remetente = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));


        Mensagem msg = new Mensagem();
        msg.setConteudo(conteudo);
        msg.setDataEnvio(Instant.now());
        msg.setLida(false);
        msg.setReserva(reserva);


        boolean isHospede = remetente.getRole() == Role.ROLE_HOSPEDE;
        boolean isAnfitriao = remetente.getRole() == Role.ROLE_ANFITRIAO;

        if (isHospede) {
            msg.setIdRemetente(remetente.getId());
            msg.setTipoRemetente("HOSPEDE");

            msg.setIdDestinatario(1L);
            msg.setTipoDestinatario("ANFITRIAO");

        } else if (isAnfitriao) {
            msg.setIdRemetente(1L);
            msg.setTipoRemetente("ANFITRIAO");

            msg.setIdDestinatario(reserva.getHospede().getId());
            msg.setTipoDestinatario("HOSPEDE");
        }

        return mensagemRepository.save(msg);
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

    public List<Mensagem> listarPorReserva(Long reservaId) {
        return mensagemRepository.findByReservaIdOrderByDataEnvioAsc(reservaId);
    }

}
