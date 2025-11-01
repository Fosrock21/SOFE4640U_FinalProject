import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Search Screen Styles
  searchContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  searchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    color: colors.textPrimary,
  },
  inputButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  inputText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // List Screen Styles
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  // Card styles for the list screen
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cardPrice: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 8,
  },
  // Detail screen styles
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: 16,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },

  // Chat Screen Styles
  chatContainer: {
    padding: 10,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  modelMessage: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  messageText: {
    fontSize: 16,
    color: colors.textPrimary, // Default text color
  },
  loadingIndicator: {
    marginVertical: 10,
  },

  // Floating Action Button Styles
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.white,
  },

  // Modal Styles for Calendar
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    width: '90%',
    alignItems: 'center',
  },
});
