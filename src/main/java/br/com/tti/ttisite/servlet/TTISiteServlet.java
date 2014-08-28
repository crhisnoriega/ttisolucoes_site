package br.com.tti.ttisite.servlet;

import java.io.*;
import java.util.Vector;

import javax.servlet.*;
import javax.servlet.http.*;


public class TTISiteServlet extends HttpServlet {

  protected void doGet( HttpServletRequest request,
                        HttpServletResponse response)
        throws ServletException, IOException {

      response.getWriter().write("<html><body>GET response</body></html>");
  }
}