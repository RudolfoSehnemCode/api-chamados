package com.rudolfo.api_chamados.service;

import com.rudolfo.api_chamados.model.Chamado;
import com.rudolfo.api_chamados.model.Status;
import com.rudolfo.api_chamados.repository.ChamadoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;

    public ChamadoService(ChamadoRepository chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    public Chamado abrirChamado(Chamado chamado){
        chamado.setStatus(Status.ABERTO);
        chamado.setDataAbertura(LocalDateTime.now());
        chamado.setDataFechamento(null);
        return chamadoRepository.save(chamado);

    }

    public List<Chamado> listarChamados(){
        return chamadoRepository.findAll();
    }

    public Chamado fecharChamado(Long id){
        Chamado chamado = chamadoRepository.findById(id).orElseThrow();
        if(chamado.getStatus() == Status.FECHADO){
            throw new RuntimeException("Chamado já fechado");
        }
        chamado.setStatus(Status.FECHADO);
        chamado.setDataFechamento(LocalDateTime.now());

        return chamadoRepository.save(chamado);
    }
}
