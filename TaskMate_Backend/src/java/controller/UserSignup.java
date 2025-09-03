/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Gender;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "UserSignup", urlPatterns = {"/UserSignup"})
@MultipartConfig
public class UserSignup extends HttpServlet {

    private static final String UPLOAD_PATH = "web/uploads/users";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject resObject = new JsonObject();
        resObject.addProperty("status", false);

        String name = request.getParameter("name");
        Integer genderId = Integer.parseInt(request.getParameter("gender"));
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        Part imagePart = request.getPart("image");
        String fileType = imagePart.getContentType();

        if (name == null || name.isEmpty()) {
            resObject.addProperty("message", "Name is empty");
        } else if (email == null || email.isEmpty()) {
            resObject.addProperty("message", "Email is empty");
        } else if (password == null || password.isEmpty()) {
            resObject.addProperty("message", "Password is empty");
        } else if (!password.equals(confirmPassword)) {
            resObject.addProperty("message", "Password mismatch");
        } else if (genderId == null || genderId == 0) {
            resObject.addProperty("message", "Gender is empty");
        } else if (imagePart == null) {
            resObject.addProperty("message", "Image is empty");
        } else if (!fileType.equals("image/jpg") && !fileType.equals("image/jpeg") && !fileType.equals("image/png")) {
            resObject.addProperty("message", "Invalid image");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            try {
                s.beginTransaction();
                s.clear();

                Gender gender = (Gender) s.load(Gender.class, genderId);
                
                Criteria cuser = s.createCriteria(User.class);
                cuser.add(Restrictions.eq("email", email));

                if (gender == null) {
                    resObject.addProperty("message", "Gender not found");
                } else if (!cuser.list().isEmpty()) {
                    resObject.addProperty("message", "Email is already registered");
                } else {
                    String appPath = getServletContext().getRealPath("");
                    String savePath = appPath.replace("build" + File.separator + "web", UPLOAD_PATH);

                    File uploadDir = new File(savePath);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdir();
                    }

                    String fileExtension = getFileExtension(fileType);
                    String filename = System.currentTimeMillis() + "_profile" + fileExtension;
                    File savedImage = new File(uploadDir, filename);
                    Files.copy(imagePart.getInputStream(), savedImage.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    
                    User newUser = new User();
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setPassword(password);
                    newUser.setProfileImg(filename);
                    newUser.setGenderId(gender);
                    newUser.setCreatedAt(new Date());
                    
                    s.save(newUser);
                    s.getTransaction().commit();
                    
                    resObject.addProperty("status", true);
                    System.out.println("User saved successfully");
                }

            } catch (Exception e) {
                e.printStackTrace();
                resObject.addProperty("message", "Something went wrong");
            } finally {
                s.close();
            }
        }

        Gson gson = new Gson();
        String resJson = gson.toJson(resObject);
        response.setContentType("application/json");
        response.getWriter().write(resJson);

    }

    private String getFileExtension(String fileType) {
        if (fileType.equals("image/jpg")) {
            return ".jpg";
        } else if (fileType.equals("image/jpeg")) {
            return ".jpeg";
        } else if (fileType.equals("image/png")) {
            return ".png";
        } else {
            return null;
        }
    }

}
