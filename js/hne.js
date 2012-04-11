(function($, w, d) {
    // Maybe I'll expand this to do other fun stuff?
    var hne = {
        'parent': $('body > center > table')
    }
    hne.rows = hne.parent.children('tbody').children('tr');
    hne.header = hne.rows.eq(0);
    hne.content = hne.rows.eq(2);
    hne.items = hne.content.children('td').children('table').eq(0);
    hne.comments = hne.content.children('td').children('table').eq(1);

    /*
     * Add a hne-comment class to all comment rows
     */
    hne.parseComments = function() {
        hne.comments.children('tbody').children('tr').each(function(i) {
           $(this).addClass('hne-comment');
        });
    }

    hne.parseItems = function () {
        var t = hne.items.children('tbody').eq(0),
            c = false;
        if('/item' == document.location.pathname) {
            t.children('tr').first().addClass('hne-item');
            c = true;
        } else if('/newcomments' == document.location.pathname) {
            t.children('tr').each(function(i) {
                if(0 == 1 || (i % 2) == 0)
                    $(this).addClass('hne-item');
            });
            c = true;
        } else if($.inArray(document.location.pathname, ['/', '/news', '/ask', '/newest']) > -1) {
            t.children('tr').each(function(i) {
                if(0 == 1 || (i % 3) == 0)
                    $(this).addClass('hne-item');
            });
            c = true;
        }
        if(c) $('body').addClass('hne-shortcuts');
    }

    /*
     * Add a tabindex to all hne-item links
     */
    hne.addTabIndex = function() {
        $('tr.hne-item').each(function(i) {
            $(this).find('td.title a').attr('tabindex', i+1);
        });
    }
    
    /*
     * Get the width of the "offset" image that indents comments"
     */
    hne.findImageWidth = function(parent) {
        return parent.find('img[src$="ycombinator.com/images/s.gif"]')
                     .width();
    }
    
    /*
     * Hide child child comments of a given parent comment
     */
    hne.hideChildren = function(parent) {
        var child_w,
            parent_w = hne.findImageWidth(parent);
        child = parent.next('tr.hne-comment');
        while(child) {
            child_w = hne.findImageWidth(child);
            if(child_w > parent_w) { 
                child.hide();
                child = child.next('tr');
            } else {
                break;
            }
        }
    }
    
    /*
     * Show the child comments of a given parent comment
     */
    hne.showChildren = function(parent) {
        var child_w,
            parent_w = hne.findImageWidth(parent);
        child = parent.next('tr.hne-comment');
        while(child) {
            child_w = hne.findImageWidth(child);
            if(child_w > parent_w) { 
                child.show();
                child = child.next('tr');
            } else {
                break;
            }
        }
    }
    
    /*
     * Add the collapse link at the end of the comment header
     */
    hne.addCollapser = function() {
        hne.comments.find('span.comhead')
           .append(' | <a href="#" class="hne-collapse">[-]</a>');
    }

    /*
     * Change the grey URL to include subdomains
     */
    hne.showFullDomain = function() {
        hne.items.find('td.title').each(function() {
            var link = $(this).find('a'),
                comh = $(this).find('span.comhead');
            if(!link.length) return;
            var disp = link.eq(0)
                           .attr('href')
                           .replace(/https?:\/\//gi, '')
                           .split('/');
            comh.html(' (' + disp[0] + ')');
        });
    }

    /*
     * Make it happen
     */
    hne.init = function(){
        $('a[href^=http]').attr('target', '_blank');
        hne.parseComments();
        hne.parseItems();
        hne.addTabIndex();
        hne.addCollapser();
        hne.showFullDomain();
        $('a.hne-collapse').on('click', function(e) {
           var parent = $(this).parents('tr.hne-comment').eq(0);
           if('[-]' == $(this).html()) {
               hne.hideChildren(parent);
               $(this).parents('td.default').find('span.comment').hide();
               $(this).html('[+]');
            } else {
                hne.showChildren(parent)
                $(this).parents('td.default').find('span.comment').show();
                $(this).html('[-]');
            }
            e.preventDefault();
        });
    }
    
    $(d).ready(hne.init);
}(jQuery, window, document));
