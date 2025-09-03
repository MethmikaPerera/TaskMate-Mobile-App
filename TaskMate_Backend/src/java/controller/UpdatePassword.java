/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
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
@WebServlet(name = "UpdatePassword", urlPatterns = {"/UpdatePassword"})
public class UpdatePassword extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject reqObject = gson.fromJson(request.getReader(), JsonObject.class);
        
        JsonObject resObject = new JsonObject();
        resObject.addProperty("status", false);
        
        String email = reqObject.get("email").getAsString();
        String currentPassword = reqObject.get("currentPassword").getAsString();
        String newPassword = reqObject.get("newPassword").getAsString();
        String confirmPassword = reqObject.get("confirmNewPassword").getAsString();
        
        if (email == null || email.isEmpty()) {
            resObject.addProperty("message", "User details not found");
        } else if (currentPassword == null || currentPassword.isEmpty()) {
            resObject.addProperty("message", "Current password is empty");
        } else if (newPassword == null || newPassword.isEmpty()) {
            resObject.addProperty("message", "New password is empty");
        } else if (confirmPassword == null || confirmPassword.isEmpty()) {
            resObject.addProperty("message", "Confirm Password is empty");
        } else if (!newPassword.equals(confirmPassword)) {
            resObject.addProperty("message", "New password and confirmation do not match.");
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
                    String savedPassword = user.getPassword();
                    
                    if (!savedPassword.equals(currentPassword)) {
                        resObject.addProperty("message", "Incorrect current password");
                    } else {
                        user.setPassword(newPassword);
                        
                        s.update(user);
                        s.getTransaction().commit();
                        
                        resObject.addProperty("status", true);
                    }
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

}
