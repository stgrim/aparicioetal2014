library(languageR)
library(tidyverse)
library(lme4)
library(lmerTest)

source("helpers.R")

df_RT <- read.csv("Experiment_RT-trials_batch2-4.csv")
df_subj_info <- read.csv("Experiment_RT-subject_info_batches2-4.csv")
df <- left_join(df_RT, df_subj_info, by = "workerid")
df$goodsubject = ifelse(df$lang05 != "english" & df$langPref != "english", "goodsubject", "badsubject")


df$type <- as.factor(df$type)
levels(df$type) = c("full", "ellipsis")

df$matchingnumber <- as.factor(df$matchingnumber)
levels(df$matchingnumber) <- c("mismatch", "match")

df$ssc <- as.factor(df$ssc)
levels(df$ssc) <- c("singular", "plural")

# write.csv(df, "Experiment_RT-trials_batches2-4_wsubjinfo.csv", 
#           row.names = FALSE)

df <- df %>% mutate(logCritRT = log(criticalwordRT))
df$spilloverRT <- df$post1criticalwordRT
 
df[! df$condition %in% c(2,5,24,28,35),]$spilloverRT = 
    df[! df$condition %in% c(2,5,24,28,35),]$post1criticalwordRT + 
    df[! df$condition %in% c(2,5,24,28,35),]$post2criticalwordRT

df <- df %>% mutate(logspilloverRT = log(spilloverRT))

# JUDGMENTS
table(df$correct)
table(df$goodsubject,df$correct)
table(df$workerid,df$correct)

correctjudgements = df %>% 
  group_by(workerid) %>%
  summarise(numcorrect = sum(correct == 1)) %>%
  filter(numcorrect > 5)
correctjudgements = as.data.frame(correctjudgements)
goodjudgesubjects = correctjudgements$workerid

df$goodjudgesubject = ifelse(df$workerid %in% goodjudgesubjects, "goodjsubject","badjsubject")
table(df$goodsubject,df$goodjudgesubject)

m_max_interaction <- lmer(logCritRT ~ type * matchingnumber * ssc + (1 | workerid), df)
summary(m_max_interaction)

m_typeXmatch <- lmer(logCritRT ~ type * matchingnumber + (1 | workerid), df)
summary(m_typeXmatch)

anova(m_typeXmatch, m_max_interaction)


m_type_match <- lmer(logCritRT ~ type + matchingnumber + (1 | workerid), df)
summary(m_type_match)

anova(m_typeXmatch, m_type_match)

fixedm_typeXmatch <- lm(logCritRT ~ type * matchingnumber, df)
summary(fixedm_typeXmatch)


fixedm_max_interaction <- lm(logCritRT ~ type * matchingnumber * ssc, df)
summary(fixedm_max_interaction)

agr <- df %>% 
         group_by(type, matchingnumber) %>% 
         summarise(MeanLogRT = mean(logCritRT), ci.low = ci.low(logCritRT), ci.high = ci.high(logCritRT)) %>%
        mutate(ymin = MeanLogRT - ci.low, ymax = MeanLogRT + ci.high)


agr_ssc <- df %>% 
  group_by(type, matchingnumber, ssc) %>% 
  summarise(MeanLogRT = mean(logCritRT))

dodge = position_dodge(.9)

ggplot(agr, aes(type, MeanLogRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = dodge) +
  geom_errorbar(aes(ymin = ymin, ymax = ymax), width = .25, position = dodge)

ggplot(agr_ssc, aes(type, MeanLogRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = "dodge") +
  facet_wrap(~ ssc)


ggplot(df, aes(type, logCritRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = "dodge") + 
  facet_wrap(~ workerid)

agr <- df %>% 
#  filter(trialnum < 6) %>%
  group_by(type, matchingnumber, goodsubject) %>% 
  summarise(MeanLogRT = mean(logCritRT), ci.low = ci.low(logCritRT), ci.high = ci.high(logCritRT)) %>%
  mutate(ymin = MeanLogRT - ci.low, ymax = MeanLogRT + ci.high)

ggplot(agr, aes(type, MeanLogRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = dodge) +
  geom_errorbar(aes(ymin = ymin, ymax = ymax), width = .25, position = dodge) +
  facet_wrap(~ goodsubject)

agr <- df %>% 
#  filter(trialnum < 3) %>%
  group_by(type, matchingnumber, goodsubject) %>% 
  summarise(MeanLogRT = mean(logspilloverRT), ci.low = ci.low(logspilloverRT), ci.high = ci.high(logspilloverRT)) %>%
  mutate(ymin = MeanLogRT - ci.low, ymax = MeanLogRT + ci.high)

ggplot(agr, aes(type, MeanLogRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = dodge) +
  geom_errorbar(aes(ymin = ymin, ymax = ymax), width = .25, position = dodge) +
  facet_wrap(~ goodsubject)

agr <- df %>% 
  #  filter(trialnum < 3) %>%
  group_by(type, matchingnumber, goodjudgesubject) %>% 
  summarise(MeanLogRT = mean(logCritRT), ci.low = ci.low(logCritRT), ci.high = ci.high(logCritRT)) %>%
  # summarise(MeanLogRT = mean(logspilloverRT), ci.low = ci.low(logspilloverRT), ci.high = ci.high(logspilloverRT)) %>%
  mutate(ymin = MeanLogRT - ci.low, ymax = MeanLogRT + ci.high)

ggplot(agr, aes(type, MeanLogRT, fill = matchingnumber)) +
  geom_bar(stat = "identity", position = dodge) +
  geom_errorbar(aes(ymin = ymin, ymax = ymax), width = .25, position = dodge) +
  facet_wrap(~ goodjudgesubject)



