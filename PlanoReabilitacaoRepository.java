package com.kinetix.repository;

import com.kinetix.model.PlanoReabilitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface PlanoReabilitacaoRepository extends JpaRepository<PlanoReabilitacao, Long> {

    @Modifying
    @Query("UPDATE PlanoReabilitacao p SET p.status = 'FINALIZADO' WHERE p.paciente.id = :pacienteId AND p.status = 'ATIVO'")
    void finalizarPlanosAtivos(@Param("pacienteId") Long pacienteId);

    Optional<PlanoReabilitacao> findFirstByPacienteIdAndStatusOrderByDataCriacaoDesc(Long pacienteId, String status);
}