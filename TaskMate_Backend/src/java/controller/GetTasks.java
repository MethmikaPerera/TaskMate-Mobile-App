/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Task;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "GetTasks", urlPatterns = {"/GetTasks"})
public class GetTasks extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String email = request.getParameter("user");

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        
        try {
            s.beginTransaction();
            s.clear();
            
            Criteria cuser = s.createCriteria(User.class);
            cuser.add(Restrictions.eq("email", email));
            User user = (User) cuser.uniqueResult();
            
            Criteria ctasks = s.createCriteria(Task.class);
            ctasks.add(Restrictions.eq("userId", user));
            ctasks.addOrder(Order.asc("dueDate"));
            List<Task> ctaskList = ctasks.list();
            
            ArrayList taskList = new ArrayList();
            
            for (Task task : ctaskList) {
                int id = task.getId();
                String title = task.getTitle();
                String description = task.getDescription();
                
                SimpleDateFormat formatter = new SimpleDateFormat("dd MMMMM, yyyy");
                String dueDate = formatter.format(task.getDueDate());
                
                Boolean completed;
                if (task.getTaskStatusId().getId() == 1) {
                    completed = false;
                } else {
                    completed = true;
                }
                
                JsonObject taskItem = new JsonObject();
                taskItem.addProperty("id", id);
                taskItem.addProperty("title", title);
                taskItem.addProperty("description", description);
                taskItem.addProperty("dueDate", dueDate);
                taskItem.addProperty("completed", completed);
                
                taskList.add(taskItem);
            }
            
            Gson gson = new Gson();
            String responseText = gson.toJson(taskList);
            response.setContentType("application/json");
            response.getWriter().write(responseText);
            
            System.out.println(responseText);
            
            s.getTransaction().commit();
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            s.close();
        }

    }

}
