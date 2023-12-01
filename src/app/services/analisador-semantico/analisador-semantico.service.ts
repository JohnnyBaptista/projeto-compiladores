import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum Tipo {
  INT = 'int',
  BOOLEAN = 'boolean',
  VOID = 'void',
}

class ParametroFormal {
  constructor(public variaveis: Variavel[], public tipo: Tipo, public porReferencia: boolean) {}
}

class DeclaracaoProcedimento {
  constructor(public nome: string, public parametrosFormais: ParametroFormal[], public bloco: Bloco) {}
}

class Variavel {
  constructor(public nome: string, public tipo: Tipo) {}
}

class SubRotina {
  constructor(
    public nome: string,
    public tipoRetorno: Tipo,
    public parametros: Variavel[]
  ) {}
}

class Comando {
  constructor(public tipo: string) {}
}

export class Bloco {
  variaveis: Variavel[] = [];
  subRotinas: SubRotina[] = [];
  comandoComposto: Comando[] = [];
}

export class LinhaSimbolo {
  cadeia: string;
  token: string;
  categoria: string;
  tipo: 'int' | 'boolean' | '-' = '-';
  valor: boolean | string | number | null;
  escopo: string = 'main';
  utilizada = false;
}

@Injectable({
  providedIn: 'root',
})
export class AnalisadorSemanticoService {
  tabelaDeSimbolos: LinhaSimbolo[] = [];
  bloco: Bloco = new Bloco();

  simbolos$ = new BehaviorSubject<LinhaSimbolo[]>([]);

  constructor() {
    const teste = new LinhaSimbolo();
    teste.cadeia = 'teste';
    teste.token = 'id';
    teste.categoria = 'var';
    teste.tipo = 'int';
    teste.valor = 666;
    teste.escopo = 'main';
    teste.utilizada = false;
    this.tabelaDeSimbolos.push(teste);
    this.simbolos$.next(this.tabelaDeSimbolos);
  }

  add(
    cadeia: string,
    token: string,
    categoria: string,
    tipo: 'int' | 'boolean' | '-',
    valor: number | null
  ): void {
    const newLine = new LinhaSimbolo();
    newLine.cadeia = cadeia;
    newLine.token = token;
    newLine.categoria = categoria;
    newLine.tipo = tipo;
    newLine.valor = valor;
    newLine.escopo = 'main';
    newLine.utilizada = false;
    this.tabelaDeSimbolos.push(newLine);

    this.simbolos$.next(this.tabelaDeSimbolos);
    console.log(newLine);
  }

  check(cadeia: string, categoria: string): boolean {
    return (
      this.tabelaDeSimbolos.find(
        (el) => el.cadeia === cadeia && el.categoria === categoria
      ) !== undefined
    );
  }

  find(cadeia: string, categoria: string): LinhaSimbolo {
    return this.tabelaDeSimbolos.find(
      (el) => el.cadeia === cadeia && el.categoria === categoria
    );
  }

  reset(): void {
    this.tabelaDeSimbolos = [];
    this.simbolos$.next([]);
  }

  analisarPrograma(codigo: string): void {
    this.analisarBloco(codigo);
  }

  analisarBloco(codigo: string): void {
    const partes = codigo.split(';');

    partes.forEach((parte) => {
      parte = parte.trim();

      if (parte.startsWith('program')) {
        const programa = parte.split(' ');
        const nomePrograma = programa[1];
        console.log(`Programa: ${nomePrograma}`);
      } else if (parte.startsWith('int') || parte.startsWith('boolean')) {
        this.analisarDeclaracoesVariaveis(parte);
      } else if (parte.startsWith('begin')) {
        this.analisarComandosCompostos(parte);
      }
    });
  }

  analisarDeclaracoesVariaveis(codigo: string): void {
    const partes = codigo.split(',');

    partes.forEach((parte) => {
      parte = parte.trim();
      const tipo = parte.split(' ')[0];
      const variaveis = parte.split(' ').slice(1);

      variaveis.forEach((variavel) => {
        this.bloco.variaveis.push(new Variavel(variavel, tipo as Tipo));
      });
    });
  }

  analisarComandosCompostos(codigo: string): void {
    const comandos = codigo.split(';');
    comandos.pop();
    comandos.forEach((comando) => {
      comando = comando.trim();
      this.bloco.comandoComposto.push(new Comando(comando));
    });
  }

  adicionarSimbolo(
    cadeia: string,
    token: string,
    categoria: string,
    tipo: 'int' | 'boolean' | '-',
    valor: number | null
  ): void {
    const novoSimbolo = new LinhaSimbolo();
    novoSimbolo.cadeia = cadeia;
    novoSimbolo.token = token;
    novoSimbolo.categoria = categoria;
    novoSimbolo.tipo = tipo;
    novoSimbolo.valor = valor;

    this.tabelaDeSimbolos.push(novoSimbolo);
  }

  verificarTipos(operando1: LinhaSimbolo, operando2: LinhaSimbolo): boolean {
    if (operando1.tipo === operando2.tipo) {
      return true;
    } else {
      console.error(
        `Erro semântico: Tipos incompatíveis - ${operando1.tipo} e ${operando2.tipo}`
      );
      return false;
    }
  }

  analisarDeclaracoesSubrotinas(codigo: string): void {
    const partes = codigo.split(';');

    partes.forEach((parte) => {
      parte = parte.trim();

      if (parte.startsWith('procedure')) {
        this.analisarDeclaracaoProcedimento(parte);
      }
    });
  }

  analisarDeclaracaoProcedimento(codigo: string): void {
    const partes = codigo.split(' ');
    const nomeProcedimento = partes[1];
    const parametrosFormais: ParametroFormal[] = [];
    console.log(`Procedimento: ${nomeProcedimento}`);

    const parametrosFormaisInicio = codigo.indexOf('(');
    const parametrosFormaisFim = codigo.indexOf(')');

    if (parametrosFormaisInicio !== -1 && parametrosFormaisFim !== -1) {
      const parametrosFormaisTexto = codigo.substring(parametrosFormaisInicio + 1, parametrosFormaisFim);
      const parametrosFormais = parametrosFormaisTexto.split(';').map((parametroFormal) => {
        parametroFormal = parametroFormal.trim();

        const porReferencia = parametroFormal.startsWith('var');
        const variaveisTexto = porReferencia ? parametroFormal.substring(3).trim() : parametroFormal;
        const variaveis = variaveisTexto.split(',').map((variavel) => {
          const nomeVariavel = variavel.trim().split(' ')[1];
          const tipoVariavel = variavel.trim().split(' ')[0] as Tipo;
          return new Variavel(nomeVariavel, tipoVariavel);
        });

        const tipoParametro = porReferencia ? Tipo.VOID : variaveis[0].tipo;

        return new ParametroFormal(variaveis, tipoParametro, porReferencia);
      });

      console.log(`Parâmetros Formais: ${JSON.stringify(parametrosFormais)}`);
    }

    const blocoInicio = codigo.indexOf(';') + 1;
    const blocoFim = codigo.indexOf('begin');
    const blocoCodigo = codigo.substring(blocoInicio, blocoFim).trim();

    const bloco = new Bloco();
    this.analisarBloco(blocoCodigo);

    const declaracaoProcedimento = new DeclaracaoProcedimento(nomeProcedimento, parametrosFormais, bloco);
    console.log(`Declaração de Procedimento: ${JSON.stringify(declaracaoProcedimento)}`);
  }

}
