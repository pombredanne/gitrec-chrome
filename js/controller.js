var Gitrec = Gitrec || {};
(function(Gitrec) {

  /*
   * Gets the repo page templates and injects them onto the page
   */
  var setupRepoPage = function() {
    var repository = Gitrec.getUsername() + "/" + Gitrec.getRepository();

    Gitrec.Templator.get(Gitrec.Templator.TEMPLATES.REPO_TAB, function(repo_tab_string) {
      $("ul.repo-menu").eq(1).prepend(_.template(repo_tab_string)());

      $("li[original-title=Gitrec]").click(function(e) {
        // Make sure UI is updated
        $("ul.repo-menu li a").removeClass("selected");
        $(this).find("a").addClass("selected");

        $("div.repository-with-sidebar.repo-container").addClass("with-full-navigation");

        // Get recommendations and inject
        Gitrec.Api.getRepoRecommendations(repository, function(recommendations) {
          Gitrec.Templator.get(Gitrec.Templator.TEMPLATES.REPO_RECOMMENDATIONS, function(recommendations_string) {
            $("#js-repo-pjax-container").html(_.template(recommendations_string)({
              recommendations : recommendations.recommendations
            }));
          });
        }, function(error) {
          Gitrec.Templator.get(Gitrec.Templator.TEMPLATES.REPO_RECOMMENDATIONS_ERROR, function(recommendations_string) {
            $("#js-repo-pjax-container").html(_.template(recommendations_string)({}));
          });
        });

        // Github pjax from taking over
        e.stopPropagation();
      });
    });
  };

  /*
   * Gets the user page templates and the users recommendations, and injects them onto
   * the page.
   */
  var setupUserPage = function() {
    try {
      var username = Gitrec.getUsername();
      Gitrec.Api.getUserRecommendations(username, function(data) {
        Gitrec.Templator.get(Gitrec.Templator.TEMPLATES.USER_RECOMMENDATIONS, function(user_template_string) {
          var user_recommendations_html = _.template(user_template_string)({
            username : username,
            interest_recommendations: data.interest_recommendations,
            contribution_recommendations : data.contribution_recommendations
          });

          var inject_html = function() {
            // Debounce to allow new nav elements to be injected.
            // NOTE: This is ugly, I do not like this. Halp!
            $("ul.tabnav-tabs > li").click(_.debounce(inject_html, 300));
            $("div.popular-repos").after(user_recommendations_html);
          };

          inject_html();
        });
      });
    } catch(e) {
      console.log(e.message);
    }
  };
  


  $(document).ready(function() {
    try {
      var current_page = Gitrec.Pagechecker.detectPage();

      switch(current_page) {
        case Gitrec.Pagechecker.PAGES.USER_PAGE:
          setupUserPage();
          break;
        case Gitrec.Pagechecker.PAGES.REPO_PAGE:
          setupRepoPage();
          break;
        default:
          console.error("unknown page");
      }
    } catch(err) {
      console.log(err);
    }
  });
})(Gitrec);
