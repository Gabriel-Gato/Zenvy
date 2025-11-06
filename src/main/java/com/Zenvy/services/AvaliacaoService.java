package com.Zenvy.services;

import com.Zenvy.exceptions.ResourceNotFoundException;
import com.Zenvy.models.Avaliacao;
import com.Zenvy.models.Imovel;
import com.Zenvy.models.Usuario;
import com.Zenvy.repositories.AvaliacaoRepository;
import com.Zenvy.repositories.ImovelRepository;
import com.Zenvy.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final ImovelRepository imovelRepository;
    private final UsuarioRepository usuarioRepository;

    public Avaliacao criarAvaliacao(Long imovelId, Long autorId, Avaliacao avaliacao) {
        var imovel = imovelRepository.findById(imovelId)
                .orElseThrow(() -> new IllegalArgumentException("Imóvel não encontrado"));

        var autor = usuarioRepository.findById(autorId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (avaliacao.getNota() == null || avaliacao.getNota() < 1 || avaliacao.getNota() > 5) {
            throw new IllegalArgumentException("A nota deve ser entre 1 e 5");
        }

        avaliacao.setImovel(imovel);
        avaliacao.setAutor(autor);
        avaliacao.setDataAvaliacao(LocalDate.now());

        return avaliacaoRepository.save(avaliacao);
    }

    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAll();
    }

    public List<Avaliacao> listarPorImovel(Long imovelId) {
        return avaliacaoRepository.findByImovelId(imovelId);
    }

    public Avaliacao atualizar(Long id, Avaliacao avaliacaoAtualizada) {
        var avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada"));

        if (avaliacaoAtualizada.getNota() != null &&
                avaliacaoAtualizada.getNota() >= 1 &&
                avaliacaoAtualizada.getNota() <= 5) {
            avaliacao.setNota(avaliacaoAtualizada.getNota());
        }

        if (avaliacaoAtualizada.getComentario() != null && !avaliacaoAtualizada.getComentario().isEmpty()) {
            avaliacao.setComentario(avaliacaoAtualizada.getComentario());
        }

        return avaliacaoRepository.save(avaliacao);
    }

    public void deletarPorId(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }

    public double calcularMediaPorImovel(Long imovelId) {
        var avaliacoes = avaliacaoRepository.findByImovelId(imovelId);
        if (avaliacoes.isEmpty()) return 0.0;
        double soma = avaliacoes.stream()
                .mapToDouble(Avaliacao::getNota)
                .sum();

        return soma / avaliacoes.size();
    }
}
