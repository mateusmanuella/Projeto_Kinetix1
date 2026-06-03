package com.kinetix.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "plano_exercicio")
public class PlanoExercicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plano_id")
    private PlanoReabilitacao plano;

    @ManyToOne
    @JoinColumn(name = "exercicio_id")
    private Exercicio exercicio;

    private Integer series;
    private Integer repeticoes;

    @Column(name = "tempo_execucao")
    private Integer tempoExecucao;
}