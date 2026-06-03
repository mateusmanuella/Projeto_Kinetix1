package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
}
