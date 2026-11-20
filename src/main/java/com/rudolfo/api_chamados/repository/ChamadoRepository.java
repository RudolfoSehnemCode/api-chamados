package com.rudolfo.api_chamados.repository;

import com.rudolfo.api_chamados.model.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
}
