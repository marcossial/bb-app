import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Conscientização</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            1. Da Mesa de Cartas ao Celular: A Evolução das Bets
          </Text>
          <Text style={styles.paragraph}>
            Antigamente, apostar exigia presença física — uma mesa de poker
            entre amigos, um cassino ou uma banca de apostas. O ritmo era lento,
            o valor do dinheiro era palpável e existiam pausas naturais. Com a
            digitalização e o surgimento das bets e jogos de slot online (como o
            jogo do Tigrinho), o cassino passou a morar dentro do bolso do
            usuário, disponível 24 horas por dia. Sons vibrantes, animações
            aceleradas e gráficos chamativos foram projetados para capturar a
            atenção e eliminar o tempo de reflexão entre cada jogada.
          </Text>
          <Text style={styles.paragraph}>
            A grande mudança, no entanto, está no algoritmo. Nas plataformas
            digitais, tudo é regido pela matemática do RTP (Return to Player),
            uma margem programada que garante que a casa sempre sairá no lucro
            no longo prazo. O jogo moderno foi desenhado não como um
            investimento ou uma oportunidade de renda, mas como uma máquina de
            retenção criada para manter você clicando o maior tempo possível.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            2. Entendendo o Vício: A Armadilha da Dopamina
          </Text>
          <Text style={styles.paragraph}>
            O vício em apostas (ludopatia) é uma dependência silenciosa que atua
            diretamente no sistema de recompensa do cérebro. A neurociência
            mostra que a dopamina não é liberada apenas quando você ganha, mas
            principalmente durante a expectativa do resultado. Por isso, a
            chamada "quase vitória" — quando falta apenas um símbolo para rodar
            o grande prêmio — ativa o cérebro praticamente da mesma forma que um
            ganho real, gerando a ilusão de que a vitória está próxima e
            estimulando o impulso de jogar novamente.
          </Text>
          <Text style={styles.paragraph}>
            Com o passar do tempo, a dinâmica muda de forma perigosa: o usuário
            deixa de apostar pelo dinheiro e passa a apostar pelo simples
            impulso de continuar no jogo, tentando anestesiar o estresse ou
            preencher um vazio. O vício se consolida quando a pessoa entra na
            espiral de "correr atrás do prejuízo" (chasing losses), escondendo
            dívidas, isolando-se de amigos e familiares e perdendo a noção do
            valor real do dinheiro.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            3. Luz no Fim do Túnel: Retomando o Controle
          </Text>
          <Text style={styles.paragraph}>
            Compreender que as plataformas são estruturadas para o lucro da casa
            é o primeiro passo para quebrar o ciclo. O vício em apostas não é
            uma falha de caráter ou falta de força de vontade, mas uma resposta
            biológica a estímulos projetados para viciar. Superar essa fase
            exige ações práticas de proteção: autoexcluir-se das plataformas,
            utilizar bloqueadores de sites de aposta, impor limites severos às
            movimentações bancárias e, se necessário, transferir temporariamente
            o controle financeiro para alguém de confiança.
          </Text>
          <Text style={styles.paragraph}>
            Aceitar que o dinheiro perdido ficou no passado é essencial para
            interromper o ciclo de perdas. Ao parar de apostar, o cérebro
            gradualmente recupera a sensibilidade aos prazeres cotidianos e à
            rotina real. Com apoio de familiares, profissionais de saúde mental
            ou grupos de ajuda como os Jogadores Anônimos, é totalmente possível
            reconquistar a saúde financeira, a paz mental e a liberdade de
            construir um futuro estável.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    color: colors.accentLime || "#9DFF20",
    fontFamily: typography.fonts.condensed,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 32,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.bgCard || "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginBottom: 16,
    lineHeight: 24,
  },
  paragraph: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 22,
    marginBottom: 12,
    textAlign: "justify",
  },
});
