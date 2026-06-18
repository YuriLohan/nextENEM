
CREATE TABLE Curso (
    idCurso     INT          NOT NULL AUTO_INCREMENT,
    Titulo      VARCHAR(45)  NOT NULL,
    Descricao   VARCHAR(255) NOT NULL,
    PRIMARY KEY (idCurso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Usuario (
    idUsuario        INT           NOT NULL AUTO_INCREMENT,
    Nome             VARCHAR(45)   NOT NULL,
    Email            VARCHAR(150)  NOT NULL,
    Senha           VARCHAR(10)  NOT NULL,
    Data_Nascimento  DATE        NOT NULL,
    Tipo_Acesso      ENUM('premium','free') NOT NULL DEFAULT 'free',
       Curso_idCurso    INT,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUsuario),
    UNIQUE KEY uq_email (Email),
    CONSTRAINT fk_usuario_curso
        FOREIGN KEY (Curso_idCurso)
        REFERENCES Curso (idCurso)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Assinatura (
    idAssinatura        INT             NOT NULL AUTO_INCREMENT,
    Data_Inicio         DATE            NOT NULL,
    Data_Vencimento     DATE            NOT NULL,
    Status              ENUM('ativa','cancelada','expirada') NOT NULL DEFAULT 'ativa',
    Tipo_Plano          ENUM('free','mensal','anual')        NOT NULL DEFAULT 'free',
    Valor               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    Usuario_idUsuario   INT             NOT NULL,
    PRIMARY KEY (idAssinatura),
    CONSTRAINT fk_assinatura_usuario
        FOREIGN KEY (Usuario_idUsuario)
        REFERENCES Usuario (idUsuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Materia (
    idMateria   INT          NOT NULL AUTO_INCREMENT,
    Titulo      VARCHAR(45)  NOT NULL,
    Descricao   VARCHAR(255) NOT NULL,
    PRIMARY KEY (idMateria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Curso_has_Materia (
    Curso_idCurso     INT            NOT NULL,
    Materia_idMateria INT            NOT NULL,
    Peso              DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    Ordem_Prioridade  INT            NOT NULL DEFAULT 1,
    PRIMARY KEY (Curso_idCurso, Materia_idMateria),
    CONSTRAINT fk_chm_curso
        FOREIGN KEY (Curso_idCurso)
        REFERENCES Curso (idCurso)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_chm_materia
        FOREIGN KEY (Materia_idMateria)
        REFERENCES Materia (idMateria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Conteudo (
    idConteudo          INT          NOT NULL AUTO_INCREMENT,
    Titulo              VARCHAR(45)  NOT NULL,
    Descricao           VARCHAR(255) NOT NULL,
    Nivel_Dificuldade   ENUM('facil','medio','dificil') NOT NULL DEFAULT 'medio',
    Ordem               INT          NOT NULL DEFAULT 1,
    Materia_idMateria   INT          NOT NULL,
    PRIMARY KEY (idConteudo),
    CONSTRAINT fk_conteudo_materia
        FOREIGN KEY (Materia_idMateria)
        REFERENCES Materia (idMateria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Questao (
    idQuestao          INT           NOT NULL AUTO_INCREMENT,
    Enunciado          TEXT          NOT NULL,
    Explicacao         TEXT,
       Vestibular         VARCHAR(100),
    Ano                YEAR,
    Conteudo_idConteudo INT          NOT NULL,
    PRIMARY KEY (idQuestao),
    CONSTRAINT fk_questao_conteudo
        FOREIGN KEY (Conteudo_idConteudo)
        REFERENCES Conteudo (idConteudo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Alternativa (
    idAlternativa      INT           NOT NULL AUTO_INCREMENT,
    Letra              CHAR(1)       NOT NULL,
    Descricao          VARCHAR(255)  NOT NULL,
    Correto            TINYINT(1)    NOT NULL DEFAULT 0,
    Questao_idQuestao  INT           NOT NULL,
    PRIMARY KEY (idAlternativa),
    CONSTRAINT fk_alternativa_questao
        FOREIGN KEY (Questao_idQuestao)
        REFERENCES Questao (idQuestao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Progresso (
    idProgresso          INT         NOT NULL AUTO_INCREMENT,
    Data_Inicio          DATE        NOT NULL,
    Data_Conclusao       DATE        NOT NULL,
    Percentual_Avanco    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    Concluido            BOOLEAN     NOT NULL DEFAULT FALSE,
    Usuario_idUsuario    INT         NOT NULL,
    Conteudo_idConteudo  INT         NOT NULL,
    PRIMARY KEY (idProgresso),
    UNIQUE KEY uq_progresso (Usuario_idUsuario, Conteudo_idConteudo),
    CONSTRAINT fk_progresso_usuario
        FOREIGN KEY (Usuario_idUsuario)
        REFERENCES Usuario (idUsuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_progresso_conteudo
        FOREIGN KEY (Conteudo_idConteudo)
        REFERENCES Conteudo (idConteudo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Simulado (
    idSimulado        INT          NOT NULL AUTO_INCREMENT,
        Data_Criacao      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Usuario_idUsuario INT          NOT NULL,
    PRIMARY KEY (idSimulado),
    CONSTRAINT fk_simulado_usuario
        FOREIGN KEY (Usuario_idUsuario)
        REFERENCES Usuario (idUsuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ;


CREATE TABLE Simulado_has_Questao (
    Simulado_idSimulado         INT         NOT NULL,
    Questao_idQuestao           INT         NOT NULL,
    Ordem                       INT         NOT NULL DEFAULT 1,
    Alternativa_Escolhida       CHAR(1),
    PRIMARY KEY (Simulado_idSimulado, Questao_idQuestao),
    CONSTRAINT fk_shq_simulado
        FOREIGN KEY (Simulado_idSimulado)
        REFERENCES Simulado (idSimulado)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_shq_questao
        FOREIGN KEY (Questao_idQuestao)
        REFERENCES Questao (idQuestao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE Resultado_Simulado (
    idResultado               INT           NOT NULL AUTO_INCREMENT,
    Nota                      DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
    Total_Questoes            INT           NOT NULL DEFAULT 0,
    Total_Acertos             INT           NOT NULL DEFAULT 0,
    Tempo_Gasto_Minutos       INT,
    Data_Conclusao            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Simulado_idSimulado       INT           NOT NULL,
    PRIMARY KEY (idResultado),
    UNIQUE KEY uq_resultado_simulado (Simulado_idSimulado),
    CONSTRAINT fk_resultado_simulado
        FOREIGN KEY (Simulado_idSimulado)
        REFERENCES Simulado (idSimulado)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


