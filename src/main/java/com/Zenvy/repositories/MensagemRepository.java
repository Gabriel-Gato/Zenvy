package com.Zenvy.repositories;

import com.Zenvy.models.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    List<Mensagem> findByIdRemetenteOrderByDataEnvioDesc(Long idRemetente);

    List<Mensagem> findByIdDestinatarioOrderByDataEnvioDesc(Long idDestinatario);
}
