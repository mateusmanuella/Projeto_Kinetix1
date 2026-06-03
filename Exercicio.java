package com.kinetix.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exercicio")
public class Exercicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "video_url")
    private String videoUrl;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaExercicio categoria;
}