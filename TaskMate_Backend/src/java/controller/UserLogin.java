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
import java.text.SimpleDateFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "UserLogin", urlPatterns = {"/UserLogin"})
public class UserLogin extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject requestObject = gson.fromJson(request.getReader(), JsonObject.class);
        
        JsonObject resObject = new JsonObject();
        resObject.addProperty("status", false);
        
        String reqEmail = requestObject.get("email").getAsString();
        String reqPassword = requestObject.get("password").getAsString();
        
        if (reqEmail == null || reqEmail.isEmpty()) {
            resObject.addProperty("message", "Email is required");
        } else if (reqPassword == null || reqPassword.isEmpty()) {
            resObject.addProperty("message", "Password is required");
        } else if (!Util.isEmailValid(reqEmail)) {
            resObject.addProperty("message", "Enter a valid email");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            
            try {
                Criteria c = s.createCriteria(User.class);
                c.add(Restrictions.eq("email", reqEmail));
                c.add(Restrictions.eq("password", reqPassword));
                
                if (c.list().isEmpty()) {
                    resObject.addProperty("message", "Invalid user credentials");
                } else {
                    User user = (User) c.list().get(0);
                    int uid = user.getId();
                    String name = user.getName();
                    String email = user.getEmail();
                    int genderId = user.getGenderId().getId();
                    String genderName = user.getGenderId().getName();
                    String profileImg = user.getProfileImg();
                    
                    SimpleDateFormat formatter = new SimpleDateFormat("dd MMMMM, yyyy");
                    String createdAt = formatter.format(user.getCreatedAt());
                    
                    resObject.addProperty("status", true);
                    resObject.addProperty("uid", uid);
                    resObject.addProperty("name", name);
                    resObject.addProperty("uemail", email);
                    resObject.addProperty("genderId", genderId);
                    resObject.addProperty("genderName", genderName);
                    resObject.addProperty("profileImg", profileImg);
                    resObject.addProperty("createdAt", createdAt);
                }
                
            } catch (Exception e) {
                e.printStackTrace();
                resObject.addProperty("message", "Something went wrong");
            } finally {
                s.close();
            }
        }
        
        String responseText = gson.toJson(resObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
        
    }

}
