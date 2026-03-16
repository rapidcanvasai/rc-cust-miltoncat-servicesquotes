# 📝 Observações

25 de fev. de 2026

## Reunião em 25 de fev. de 2026 às 15:39 GMT-03:00

Registros da reunião [Transcrição](?tab=t.s8kvsxu0pb2n) 

### Resumo

Lucas Inacio Luz e Davis Gallagher confirmaram a correção dos resultados da geração de dados, decidindo pela remoção de "trabalhos padrão" com valores zero para mão de obra e com Lucas Inacio Luz confirmando os volumes de dados para trabalhos padrão (9.440 combinações) e ordens de serviço (77.000 combinações). Davis Gallagher levantou preocupações sobre a variação e confiança nos trabalhos padrão, e Lucas Inacio Luz se comprometeu a obter e compartilhar o número exato da magnitude dessa variação antes da próxima reunião. Para garantir a transição durante as férias de Lucas Inacio Luz, que coordenará com Harders, Davis Gallagher sugeriu uma reunião de 30 minutos na sexta-feira com Davis Gallagher, Lucas Inacio Luz e Harders, com Gabriel Gomez cobrindo o trabalho na ausência de Lucas Inacio Luz.

### Detalhes

* **Ajuste na Geração de Dados e Exclusão de Valores Zero**: Lucas Inacio Luz e Davis Gallagher confirmaram que os resultados da geração de dados estavam corretos, apesar de Davis Gallagher inicialmente ter esquecido de pressionar o botão de geração. Uma melhoria a ser implementada é a remoção de "trabalhos padrão" (standard jobs) que apresentam valores zero para mão de obra (labor), pois esses dados não seriam úteis ([00:00:00](#00:00:00)). Lucas Inacio Luz mencionou que Harders ajudará a garantir que a funcionalidade de exclusão esteja operacional na próxima semana, quando Lucas Inacio Luz estiver de férias ([00:08:45](#00:08:45)).

* **Planejamento de Transição e Cobertura de Férias**: Lucas Inacio Luz estará de férias na semana seguinte e coordenará com Harders para garantir a continuidade do trabalho. Davis Gallagher sugeriu uma reunião de 30 minutos na sexta-feira, antes das férias de Lucas Inacio Luz, envolvendo Davis Gallagher, Lucas Inacio Luz e Harders, para garantir uma transição suave e que todos estejam alinhados ([00:08:45](#00:08:45)). Durante as férias de Lucas Inacio Luz, Gabriel Gomez estará de volta e cobrirá o trabalho no seu lugar ([00:09:51](#00:09:51)).

* **Confirmação dos Volumes de Dados para Trabalhos Padrão e Ordens de Serviço**: Lucas Inacio Luz confirmou os volumes de dados para trabalhos padrão (standard jobs) e ordens de serviço (work orders). Existem 9.440 combinações exclusivas em trabalhos padrão, com 33.000 registros, e 77.000 combinações exclusivas de possíveis ordens de serviço, com um conjunto maior de registros ([00:09:51](#00:09:51)).

* **Variação e Confiança nos Trabalhos Padrão**: Davis Gallagher questionou se os trabalhos padrão deveriam, por natureza, indicar alta confiança, e se a variação observada nos dados deveria alterar essa percepção ([00:09:51](#00:09:51)). Lucas Inacio Luz concordou que os trabalhos padrão deveriam ter alta confiança e que a melhor ideia seria tentar selecionar um modelo para obter as informações, mas enquanto isso não estiver disponível, é preciso seguir a regra discutida. Davis Gallagher pediu para entender a magnitude da variação nos registros de trabalhos padrão, e Lucas Inacio Luz se comprometeu a obter o número exato e compartilhá-lo antes da próxima reunião ([00:11:14](#00:11:14)).

### Próximas etapas sugeridas

- [ ] Lucas Inacio Luz, Davis Gallagher e Herbert farão uma reunião de 30 minutos na sexta-feira, antes de Lucas Inacio Luz sair de férias, para garantir que a transição esteja completa.

*Revise as anotações do Gemini para checar se estão corretas. [Confira dicas e saiba como o Gemini faz anotações](https://support.google.com/meet/answer/14754931)*

*Envie feedback sobre o uso do Gemini para criar notas [breve pesquisa.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=1q44NAWtyalPGDd4WPWdDxIVOAIIigIgABgFCA&detailid=standard)*

# 📖 Transcrição

25 de fev. de 2026

## Reunião em 25 de fev. de 2026 às 15:39 GMT-03:00 \- Transcrição

### 00:00:00 {#00:00:00}

   
**Lucas Inacio Luz:** Так. Ah. Hej Davis.  
**Davis Gallagher:** He has gone well doing  
**Lucas Inacio Luz:** I'm fine.  
**Davis Gallagher:** well. Thank you. How's uh how's everything going? Busy? Yeah.  
**Lucas Inacio Luz:** Yeah.  
**Davis Gallagher:** Imagine uh sorry I'm just uh I'm just responding to your message. I'm just an idiot. I forgot to press the generate qu button.  
**Lucas Inacio Luz:** Ah. Oh my god. No problem.  
**Davis Gallagher:** Thank you.  
**Lucas Inacio Luz:** No problem.  
**Davis Gallagher:** Um,  
**Lucas Inacio Luz:** Yeah, but if you try again the results looks good.  
**Davis Gallagher:** yeah, the results are the results are right.  
**Lucas Inacio Luz:** Oh, nice. Cool. Cool.  
**Davis Gallagher:** I was I I was completely not I will  
**Lucas Inacio Luz:** Great. No problem. No  
**Davis Gallagher:** say the the only thing is we might want to remove standard jobs that have like full outliers and like I  
**Lucas Inacio Luz:** problem.  
**Davis Gallagher:** see for 75 46 for example we have a bunch of standard jobs with zeros uh in  
**Lucas Inacio Luz:** Mhm.  
**Davis Gallagher:** across the entire set so we might want to remove  
**Lucas Inacio Luz:** G  
**Davis Gallagher:** All right,  
   
 

### 00:08:45 {#00:08:45}

   
**Lucas Inacio Luz:** Угу.  
**Davis Gallagher:** just documenting that. Um, cool. All right. Well, it's working. It's working better. I just didn't press the button. The only small thing, like I said, is um I think when we have standard jobs that are in there as zero for labor, like 0 across everything, we probably should disregard. I assume that uh it won't be a very helpful data to have a standard job that's zero for everything. So um we just put that as enhancement.  
**Lucas Inacio Luz:** Mhm.  
**Davis Gallagher:** We remove all zeros all standard jobs with values of  
**Lucas Inacio Luz:** Yeah. Got it.  
**Davis Gallagher:** zero.  
**Lucas Inacio Luz:** Yeah. So, next week I will be on vacation so I can share with Harders to help me to make sure that everything is working to next week.  
**Davis Gallagher:** Yeah, that would be great.  
**Lucas Inacio Luz:** Okay.  
**Davis Gallagher:** And are you going to meet with Herbert? Are you going to connect offline?  
**Lucas Inacio Luz:** Yeah, I can connect the line with with him.  
**Davis Gallagher:** Ok.  
**Lucas Inacio Luz:** And I can share in the channel as well if you  
**Davis Gallagher:** Yeah, it it might be helpful maybe Friday just before you leave,  
**Lucas Inacio Luz:** want.  
**Davis Gallagher:** you him and I get like 30 minutes on the calendar.  
   
 

### 00:09:51 {#00:09:51}

   
**Davis Gallagher:** We just make sure that the hand off is all good. Everybody's on the same page and you can enjoy the the two weeks  
**Lucas Inacio Luz:** Perfect.  
**Davis Gallagher:** off.  
**Lucas Inacio Luz:** Ok sounds good. And and also for top Gabriel Gomez will be back from the vacation so he will be on my me on top. Ok. Yeah, that's  
**Davis Gallagher:** Perfect perfect. Ok. Um, all right. What did I want to quickly get on about? Um, let me just double check. Um, yes, I just want to make sure when I'm walking through this with Tim in terms of uh the data that we have for standard jobs and work orders. So, you said we have basically 9,440 unique combinations from the three different fields in the standard jobs with 33,000 records of standard jobs. It's the same thing for workers. 70,000 77,000 unique combinations of possible work orders with a larger set of records. Is that right?  
**Lucas Inacio Luz:** Ja. Ja.  
**Davis Gallagher:** Ok, perfect, perfect. Glad I interpret that, right? Um, the only I guess so my question is in terms of when we talk about the confidence for uh things with standard jobs, uh I know that we have multiple sets of standard jobs for a given combination.  
   
 

### 00:11:14 {#00:11:14}

   
**Davis Gallagher:** So I guess what my intuition felt like a standard job means it should be a high confidence by nature, but do you think that because of the uh variation and the number of standard jobs that that shouldn't be the case or do you still agree?  
**Lucas Inacio Luz:** Yeah, I agree with you and I I mean I I mean this was the worked on and I don't think of the customer.  
**Davis Gallagher:** Ok,  
**Lucas Inacio Luz:** sitation best idea is try to chose a model right to get information but as far I we don't have it I think we need to this role as we discuss on the  
**Davis Gallagher:** got it. I guess how much variation do you see or how much variation have we seen the standard jobs? Like I know we have some with a significant number of records, some with a lower number of records. Like I guess I'm just trying to understand how big the variance is across the set. Is there a lot of variance? Is there a little variance in standard jobs? I know work order is going to have a lot of variance, but for standard jobs specifically, what does that look like? Do you know?  
**Lucas Inacio Luz:** Mhm. Yeah, actually I don't have exactly number but I can get here and back to you.  
**Davis Gallagher:** Ok.  
**Lucas Inacio Luz:** I can do it really fast before the the meeting so I can share with you.  
**Davis Gallagher:** Yeah, that would be helpful. This is more just for a frame of reference for myself. I'm still trying to like get my head around how all the the different calculations work and all the data that we have. So, it's just a nothing too urgent, just a helpful figure for me.  
**Lucas Inacio Luz:** Mhm.  
**Davis Gallagher:** So, that would be great.  
**Lucas Inacio Luz:** Okej, okej.  
**Davis Gallagher:** Cool. All right. Well, that's that's all I got. I just want to get on that quickly. before we met with them, but very much appreciate all the good work and um yeah, let me know if there's anything I can do to help you out. And I'm sure we we'll talk again before you get out. Yeah, absolutely. Absolutely.  
   
 

### A transcrição foi encerrada após 00:13:46

*Esta transcrição editável foi gerada por computador e pode conter erros. As pessoas também podem alterar o texto depois que ele for criado.*