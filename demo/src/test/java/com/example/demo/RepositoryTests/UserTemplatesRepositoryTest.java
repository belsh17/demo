package com.example.demo.RepositoryTests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.entity.Project;
import com.entity.User;
import com.entity.UserTemplates;
import com.repository.UserTemplatesRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserTemplatesRepositoryTest {
    
    @Autowired
    private UserTemplatesRepository userTemplatesRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void UserTemplatesRepository_testFindByUserAndProject_ReturnTemplate(){
        //ARRANGE - create and save a user, project and template
        User user = new User();
        user.setFullName("Isabella");
        user.setUsername("bellacar17");
        user.setEmail("isabella@test.com");
        user.setPassword("test123");
        entityManager.persist(user);

        Project project = new Project();
        project.setProjectName("Test Project");
        entityManager.persist(project);

        UserTemplates template = new UserTemplates();
        template.setUser(user);
        template.setProject(project);
        template.setTemplateName("My Template");
        template.setTemplateType("Marketing");
        template.setTemplateData("Sample data");
        template.setSaveDate(new Date());
        entityManager.persist(template);

        entityManager.flush();
        entityManager.clear();
        //userTemplatesRepository.save(template);

        User managedUser = entityManager.find(User.class, user.getId());
        Project managedProject = entityManager.find(Project.class, project.getId());

        //ACT
        List<UserTemplates> results = userTemplatesRepository.findByUserAndProject(managedUser, managedProject);
        
        //ASSERT
        //assertEquals(1, results.size());
        Assertions.assertThat(results).isNotNull();
        assertEquals("My Template", results.get(0).getTemplateName());
    }
}
