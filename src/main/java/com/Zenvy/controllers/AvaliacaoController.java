package com.Zenvy.controllers;

import com.Zenvy.Model.Avaliacao;
import com.Zenvy.Service.AvaliacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacao")
@RequiredArgsConstructor
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping("/imovel/{imovelId}/autor/{autorId}")
    public ResponseEntity<Avaliacao> criarAvaliacao(
            @PathVariable Long imovelId,
            @PathVariable Long autorId,
            @RequestBody @Valid Avaliacao avaliacao) {

        var novaAvaliacao = avaliacaoService.criarAvaliacao(imovelId, autorId, avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaAvaliacao);
    }

    @GetMapping
    public ResponseEntity<List<Avaliacao>> listarTodas() {
        return ResponseEntity.ok(avaliacaoService.listarTodas());
    }

    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<Avaliacao>> listarPorImovel(@PathVariable Long imovelId) {
        return ResponseEntity.ok(avaliacaoService.listarPorImovel(imovelId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Avaliacao> atualizar(
            @PathVariable Long id,
            @RequestBody Avaliacao avaliacaoAtualizada) {

        var avaliacao = avaliacaoService.atualizar(id, avaliacaoAtualizada);
        return ResponseEntity.ok(avaliacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/media/{imovelId}")
    public ResponseEntity<Double> calcularMediaPorImovel(@PathVariable Long imovelId) {
        return ResponseEntity.ok(avaliacaoService.calcularMediaPorImovel(imovelId));
    }
}
