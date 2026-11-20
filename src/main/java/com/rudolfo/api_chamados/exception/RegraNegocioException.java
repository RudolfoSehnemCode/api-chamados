package com.rudolfo.api_chamados.exception;

public class RegraNegocioException extends RuntimeException{

    public RegraNegocioException(String mensagem){
        super(mensagem);
    }
}
