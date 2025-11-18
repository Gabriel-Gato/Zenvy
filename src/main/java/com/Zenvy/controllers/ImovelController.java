package com.Zenvy.controllers;

import com.Zenvy.dto.FiltroImovelRequest;
import com.Zenvy.dto.ImovelResponseDTO;
import com.Zenvy.dto.ImovelSimplesDTO;
import com.Zenvy.models.Imovel;
import com.Zenvy.models.Usuario;
import com.Zenvy.services.ImovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.stream.Collectors;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/imoveis")
@RequiredArgsConstructor
public class ImovelController {

    private final ImovelService imovelService;

    @PostMapping("/cadastrar")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> cadastrar(@RequestBody Imovel imovel, Authentication authentication) {
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        imovel.setAnfitriao(usuarioLogado);

        var novoImovel = imovelService.cadastrar(imovel);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoImovel);
    }

    @GetMapping("/filtro")
    public ResponseEntity<List<ImovelSimplesDTO>> filtrar(@Valid FiltroImovelRequest filtro) {

        // Busca os imóveis filtrados
        List<Imovel> resultados = imovelService.filtrarImoveis(filtro);

        // Converte cada Imovel em ImovelSimplesDTO
        List<ImovelSimplesDTO> dtoResultados = resultados.stream()
                .map(imovel -> new ImovelSimplesDTO(imovel)) // usa o construtor do DTO
                .collect(Collectors.toList()); // compatível com Java 8

        return ResponseEntity.ok(dtoResultados);
    }




    @PostMapping("/uploadImagens/{id}")
    public ResponseEntity<Imovel> uploadImagens(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        var imovelAtualizado = imovelService.salvarImagens(id, files);
        return ResponseEntity.ok(imovelAtualizado);
    }

    @PostMapping("/uploadImagem/{id}")
    public ResponseEntity<Imovel> uploadImagem(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        var imovelAtualizado = imovelService.salvarImagens(id, List.of(file));
        return ResponseEntity.ok(imovelAtualizado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> getImovel(@PathVariable Long id) {
        return ResponseEntity.ok(imovelService.buscarPorId(id));
    }


    // ---------------------------------------------------
    // Listar todos os imóveis (com DTOs)
    // ---------------------------------------------------
    @GetMapping("/listar")
    public ResponseEntity<List<ImovelResponseDTO>> listarTodos() {
        return ResponseEntity.ok(imovelService.listarTodos());
    }

    @GetMapping("/publicos")
    public ResponseEntity<List<ImovelResponseDTO>> listarPublicos(){
        return ResponseEntity.ok(imovelService.listarTodos());
    }


    // ---------------------------------------------------
    // Atualizar imóvel
    // ---------------------------------------------------
    @PutMapping("/atualizar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Imovel> atualizar(
            @PathVariable Long id,
            @RequestBody Imovel imovelAtualizado) {

        var imovel = imovelService.atualizar(id, imovelAtualizado);
        return ResponseEntity.ok(imovel);
    }

    // ---------------------------------------------------
    // Deletar imóvel
    // ---------------------------------------------------
    @DeleteMapping("/deletar/{id}")
    @PreAuthorize("hasAuthority('ROLE_ANFITRIAO')")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        imovelService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
