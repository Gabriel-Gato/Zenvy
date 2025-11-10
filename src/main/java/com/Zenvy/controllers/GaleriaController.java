package com.Zenvy.controllers;

import com.Zenvy.models.Galeria;
import com.Zenvy.services.GaleriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/galeria")
@RequiredArgsConstructor
public class GaleriaController {

    private final GaleriaService galeriaService;

    @PostMapping("/upload/{id}")
    public ResponseEntity<Galeria> salvarImagem(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        var galeriaSalva = galeriaService.salvarImagem(id, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(galeriaSalva);
    }

    @PostMapping
    public ResponseEntity<Galeria> salvar(@RequestBody Galeria galeria) {
        var novaGaleria = galeriaService.salvar(galeria);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaGaleria);
    }

    @GetMapping
    public ResponseEntity<List<Galeria>> listarTodas() {
        return ResponseEntity.ok(galeriaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Galeria> buscarPorId(@PathVariable Long id) {
        var galeria = galeriaService.buscarPorId(id);
        return ResponseEntity.ok(galeria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Galeria> atualizar(
            @PathVariable Long id,
            @RequestBody Galeria galeriaAtualizada) {

        var galeria = galeriaService.atualizar(id, galeriaAtualizada);
        return ResponseEntity.ok(galeria);
    }

    @DeleteMapping
    public ResponseEntity<Void> deletar(@RequestBody Galeria galeria) {
        galeriaService.deletar(galeria);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        galeriaService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload/{id}/multiplos")
    public ResponseEntity<List<Galeria>> salvarImagens(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) throws IOException {

        List<Galeria> imagensSalvas = galeriaService.salvarImagens(id, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(imagensSalvas);
    }

}
