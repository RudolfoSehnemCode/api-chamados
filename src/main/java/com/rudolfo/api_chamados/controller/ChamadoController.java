package com.rudolfo.api_chamados.controller;

import com.rudolfo.api_chamados.model.Chamado;
import com.rudolfo.api_chamados.service.ChamadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    private final ChamadoService chamadoService;

    public ChamadoController(ChamadoService chamadoService) {
        this.chamadoService = chamadoService;
    }

    @PostMapping
    public Chamado abrirChamado(@RequestBody Chamado chamado) {
        return chamadoService.abrirChamado(chamado);
    }

    @GetMapping
    public List<Chamado> listarChamados() {
        return chamadoService.listarChamados();
    }

    @PatchMapping("/{id}/fechar")
    public Chamado fecharChamado(@PathVariable Long id) {
        return chamadoService.fecharChamado(id);
    }
}