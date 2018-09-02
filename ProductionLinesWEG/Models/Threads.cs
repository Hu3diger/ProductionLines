﻿using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using ProductionLinesWEG.Hub;
using ProductionLinesWEG.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Web.Script.Serialization;

namespace ProductionLinesWEG.Models
{
    class Threads
    {
        private readonly IHubConnectionContext<dynamic> Clients = GlobalHost.ConnectionManager.GetHubContext<MasterHub>().Clients;
        private EsteiraAbstrata e;

        private Program program;

        public Threads(EsteiraAbstrata e, Program p)
        {
            this.e = e;
            program = p;
        }
        /// <summary>
        /// Thread pricipal de controle da esteira
        /// </summary>
        public void threadEsteira()
        {
            if (e is EsteiraModel)
            {
                EsteiraModel em = (EsteiraModel)e;

                while (true)
                {
                    // verifica se a esteira esta em condição de operação (masterProcess existe) antes de iniciar
                    if (em.IsInCondition())
                    {
                        // pega a primeira peça da fila
                        Peca pc = em.GetInputPieceNoRemove();

                        if (pc != null)
                        {
                            // reseta o processo para iniciar o ciclo todo novamente
                            em.resetProcess();

                            // verifica se existe processo adiante
                            while (em.hasNextProcess())
                            {
                                Processo ps = em.nextProcess();

                                program.toDashboard(ps.Name + " Executando", false);

                                // seta atributo
                                pc.setAtributo(ps.Name, "Kappa value", Atributo.FAZENDO);

                                // simula o tempo de um proceso real 
                                Thread.Sleep(ps.Runtime);

                                // seta atributo
                                pc.setAtributo(ps.Name, "Kappa value", Atributo.FEITO);

                                program.toDashboard(ps.Name + " Finalizado", false);
                            }

                            // finalia o processo para ter um novo ciclo
                            em.finalizeProcess();

                            // remove a peça da esteira para que a proxima peça possa ser executada
                            Peca p = em.RemovePiece();

                            program.toDashboard("Exibindo atributos da peca recém 'feita':", false);

                            // exibe todos os estados do processo (atributos)
                            p.ListAtributos.ForEach(x => program.toDashboard("Processo: " + x.Name + " / Estado: " + x.Estado, false));

                            program.toDashboard("Droped First / End\n", false);
                        }
                        else
                        {
                            program.toDashboard(em.Name + " esperando Peça", false);
                            // fica esperando a peca (250ms para não sobrecarregar o servidor)
                            Thread.Sleep(250);
                        }
                    }
                    else
                    {
                        program.toDashboard("Insert a master process in Esteira", false);
                        break;
                    }
                }
            }
            else
            {
                //while (true)
                //{

                //}
            }
        }
    }





















    //      private async void startButton_Click(object sender, RoutedEventArgs e)
    //      {
    //          // Instantiate the CancellationTokenSource.  
    //          cts = new CancellationTokenSource();
    //      
    //          resultsTextBox.Clear();
    //      
    //          try
    //          {
    //              await AccessTheWebAsync(cts.Token);
    //              // ***Small change in the display lines.  
    //              resultsTextBox.Text += "\r\nDownloads complete.";
    //          }
    //          catch (OperationCanceledException)
    //          {
    //              resultsTextBox.Text += "\r\nDownloads canceled.";
    //          }
    //          catch (Exception)
    //          {
    //              resultsTextBox.Text += "\r\nDownloads failed.";
    //          }
    //      
    //          // Set the CancellationTokenSource to null when the download is complete.  
    //          cts = null;
    //      }
    //      
    //      // Add an event handler for the Cancel button.  
    //      private void cancelButton_Click(object sender, RoutedEventArgs e)
    //      {
    //          if (cts != null)
    //          {
    //              cts.Cancel();
    //          }
    //      }
    //      
    //      // Provide a parameter for the CancellationToken.  
    //      // ***Change the return type to Task because the method has no return statement.  
    //      async Task AccessTheWebAsync(CancellationToken ct)
    //      {
    //          // Declare an HttpClient object.  
    //          HttpClient client = new HttpClient();
    //      
    //          // ***Call SetUpURLList to make a list of web addresses.  
    //          List<string> urlList = SetUpURLList();
    //      
    //          // ***Add a loop to process the list of web addresses.  
    //          foreach (var url in urlList)
    //          {
    //              // GetAsync returns a Task<HttpResponseMessage>.   
    //              // Argument ct carries the message if the Cancel button is chosen.   
    //              // ***Note that the Cancel button can cancel all remaining downloads.  
    //              HttpResponseMessage response = await client.GetAsync(url, ct);
    //      
    //              // Retrieve the website contents from the HttpResponseMessage.  
    //              byte[] urlContents = await response.Content.ReadAsByteArrayAsync();
    //      
    //              resultsTextBox.Text +=
    //                  String.Format("\r\nLength of the downloaded string: {0}.\r\n", urlContents.Length);
    //          }
    //      }
    //      
    //      // ***Add a method that creates a list of web addresses.  
    //      private List<string> SetUpURLList()
    //      {
    //          List<string> urls = new List<string>
    //              {
    //                  "http://msdn.microsoft.com",
    //                  "http://msdn.microsoft.com/library/hh290138.aspx",
    //                  "http://msdn.microsoft.com/library/hh290140.aspx",
    //                  "http://msdn.microsoft.com/library/dd470362.aspx",
    //                  "http://msdn.microsoft.com/library/aa578028.aspx",
    //                  "http://msdn.microsoft.com/library/ms404677.aspx",
    //                  "http://msdn.microsoft.com/library/ff730837.aspx"
    //              };
    //          return urls;
    //      }

}
