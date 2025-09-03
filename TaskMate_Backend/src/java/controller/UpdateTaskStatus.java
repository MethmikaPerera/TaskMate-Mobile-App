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

@WebServlet(name = "UpdateTaskStatus", urlPatterns = {"/UpdateTaskStatus"})
public class UpdateTaskStatus extends HttpServlet {

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
                int statusId = task.getTaskStatusId().getId();
                TaskStatus newStatus;
                
                if (statusId == 1) {
                    newStatus = (TaskStatus) s.load(TaskStatus.class, 2);
                } else {
                    newStatus = (TaskStatus) s.load(TaskStatus.class, 1);
                }
                
                task.setTaskStatusId(newStatus);
                s.update(task);
                s.getTransaction().commit();
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            s.close();
        }
        
    }

}
