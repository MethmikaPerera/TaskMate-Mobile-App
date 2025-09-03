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
import java.time.Instant;
import java.util.Date;
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
@WebServlet(name = "CreateTask", urlPatterns = {"/CreateTask"})
public class CreateTask extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject reqObject = gson.fromJson(request.getReader(), JsonObject.class);

        JsonObject resObject = new JsonObject();
        resObject.addProperty("status", true);

        String email = reqObject.get("email").getAsString();
        String title = reqObject.get("title").getAsString();
        String description = reqObject.get("description").getAsString();
        String dueDateString = reqObject.get("dueDate").getAsString();

        if (email == null || email.isEmpty()) {
            resObject.addProperty("message", "User details not found");
        } else if (title == null || title.isEmpty()) {
            resObject.addProperty("message", "Task title is empty");
        } else if (description == null || description.isEmpty()) {
            resObject.addProperty("message", "Task description is empty");
        } else if (dueDateString == null || dueDateString.isEmpty()) {
            resObject.addProperty("message", "Due date is empty");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            try {
                s.beginTransaction();
                s.clear();
                
                Criteria cuser = s.createCriteria(User.class);
                cuser.add(Restrictions.eq("email", email));
                User user = (User) cuser.uniqueResult();

                if (user == null) {
                    resObject.addProperty("message", "User not found");
                } else {
                    TaskStatus taskStatus = (TaskStatus) s.load(TaskStatus.class, 1);
                    Date dueDate = getTaskDate(dueDateString);

                    Task newTask = new Task();
                    newTask.setTitle(title);
                    newTask.setDescription(description);
                    newTask.setDueDate(dueDate);
                    newTask.setUserId(user);
                    newTask.setTaskStatusId(taskStatus);
                    
                    s.save(newTask);
                    s.getTransaction().commit();
                    
                    resObject.addProperty("status", true);
                }
            } catch (Exception e) {
                e.printStackTrace();
                resObject.addProperty("message", "Something went wrong");
            } finally {
                s.close();
            }
        }
        
        String resJson = gson.toJson(resObject);
        response.setContentType("application/json");
        response.getWriter().write(resJson);

    }

    private Date getTaskDate(String isoString) {
        Instant instant = Instant.parse(isoString);
        Date date = Date.from(instant);
        return date;
    }

}
