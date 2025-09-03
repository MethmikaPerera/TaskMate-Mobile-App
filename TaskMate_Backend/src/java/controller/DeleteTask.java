/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Task;
import hibernate.TaskStatus;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "DeleteTask", urlPatterns = {"/DeleteTask"})
public class DeleteTask extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject reqObject = gson.fromJson(request.getReader(), JsonObject.class);
        
        int uid = reqObject.get("userId").getAsInt();
        int taskId = reqObject.get("taskId").getAsInt();
        
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        
        try {
            s.beginTransaction();
            s.clear();
            
            User user = (User) s.load(User.class, uid);
            
            Criteria ctask = s.createCriteria(Task.class);
            ctask.add(Restrictions.eq("userId", user));
            ctask.add(Restrictions.eq("id", taskId));
            Task task = (Task) ctask.uniqueResult();
            
            if (task != null) {
                s.delete(task);
                s.getTransaction().commit();
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            s.close();
        }
        
    }

}
