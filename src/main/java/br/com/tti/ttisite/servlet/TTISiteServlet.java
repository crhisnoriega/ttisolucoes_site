package br.com.tti.ttisite.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TTISiteServlet extends HttpServlet
{

   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
   {

      response.getWriter().write("<html><body>Pagina mostrada desde codigo Servlet</body></html>");
     
   }

}